function OlService_ ($q, $state, $window, StyleService, MapService, LayerService) {
  // this factory is a singleton & provides layers, styles, etc for the edl-ol-map ... 
  // 

  var OlService = {};
  OlService.idSeed = 0;

  // HACK: dev 
  var mapDiv = {};
  mapDiv.clientHeight = 725; //HACK: why is this hardcoded? 
  OlService.mapDiv = mapDiv;
  OlService.extent = [0, 0, $window.innerWidth, OlService.mapDiv.clientHeight ];
  OlService.defaultZoom = 2;

  OlService.clearAllMapFeatures = function (map) {
    var layers = map.getLayers().getArray();
    var overlays = map.getOverlays().getArray();

    angular.forEach(layers, function(layer){
      if (layer.get('name') !== 'mapCapture') {
        layer.getSource().clear();
      }
    });

    angular.forEach(overlays, function(ovr, key){
      ovr.getFeatures().clear();
    });
    return map;
  };

  OlService.getSelectedFeature = function(){
    return OlService.selectInteraction.getFeatures().getArray();
  };

  OlService.setIdsOfFeaturearray = function(featurearray, id) { // utility for setting id. allow to later remove by id(??)
    for (var key in featurearray) {
      var f = featurearray[key];
      f.setId(id);
    }
  };

  OlService.removeFeatureById = function(id, source){
    var removeus = [];
    function findforremove(f) {
      var f_id = f.getId();
      if (f_id === id && f.getGeometryName()==="mount" && f.get('popup')) {
        MapService.getOmap().removeOverlay(f.get('popup'));
      }
      if (f_id === id) {
        removeus.push(f);
      }
    }
    source.forEachFeature(findforremove);
    for (var a in removeus) {
      source.removeFeature(removeus[a]);
    }
  };

  OlService.getFeatureFromLayerByIdAndType = function(layer, id, type) {
    var result;
    var matchType = function(f) {
      if (f.getGeometryName()=== type && f.getId() === id) {
        result = f;
      }
    };
    if (layer) {
      layer.forEachFeature(matchType);
    }
    return result;
  };

  /* sources */
  OlService.mounts = new ol.source.Vector({
    features: new ol.Collection([])
  });
  OlService.gutters = new ol.source.Vector({
    features: new ol.Collection([])
  });
  OlService.panels = new ol.source.Vector({
    features: new ol.Collection([]),
  });
  OlService.obstructions = new ol.source.Vector({
    features: new ol.Collection([])
  });
  OlService.layers = {
    mount: OlService.mounts,
    gutter: OlService.gutters,
    obstruction: OlService.obstructions, 
    panel: OlService.panels,
  };
  OlService._previewing = false;

  OlService.setPreviewMode = function setPreviewMode(status) {
    OlService._previewing = status;
    OlService.hideLayers.getLayers().getArray().forEach(function(f){
      f.setVisible(!status);
    });

    OlService.layers.mount.getFeatures().forEach(function(m){
      var overlay = m.get('popup') ? m.get('popup') : null;
      if (overlay && status) {
        MapService.getOmap().addOverlay(overlay);
      } else {
        MapService.getOmap().removeOverlay(overlay);
      }
    });


    if (status){ 
      LayerService.get('panel').setOpacity(1);
    } else {
      LayerService.get('panel').setOpacity(0.6);
    }
  };


  OlService.fillMessageForSingleMount = function(mount){
    if (mount.getGeometryName() !== "mount") throw 'err must be a mount'; 
    var wkt = OlService.wkt;
    var msg = {};
    // get all obstructions on page
    var obstructions = OlService.obstructions.getFeatures();
    // add mount points object
    msg.m = {};
    var id = parseInt(mount.getId());
    msg.m[id] = wkt.writeFeature(mount).split(',');
    msg.m[id][0] = msg.m[id][0].split('((')[1];
    msg.m[id].splice(-1); // remove the last point, it's a dupe of the 1st
    // add obstruction points object 
    msg.o = {};
    obstructions.forEach(function(feat, idx, col){
      if (feat.getGeometryName() === "obstruction") {
        idx = parseInt(idx);
        // add their points to mountpoints
        msg.o[idx] = wkt.writeFeature(feat).split(',');
        msg.o[idx][0] = msg.o[idx][0].split('(')[1];
        msg.o[idx][0] = msg.o[idx][0].split(')');
        msg.o[idx].splice(1);
        msg.o[idx] = msg.o[idx][0];
      }
    });
    return msg;
  };

  OlService.wkt = new ol.format.WKT();

  OlService.gutterLineFinder = function gutterLineFinder(event) {
    var feature = event.feature || event.target;
    var mounts  = OlService.mounts; //HACK: make this a parameter?
    var gutters = OlService.gutters; //HACK: make this a parameter?
    
    var featureId = feature.getId();
    if (featureId !== undefined) {

      OlService.removeFeatureById( featureId, OlService.gutters);
    }
    var mountfeature = feature.getGeometry();

    var featureWkt;
    var gutterLineWkt;
    var wkt = OlService.wkt;


    // get & split the WKT (well-known text) for our feature
    featureWkt = wkt.writeFeature(feature).split(' ');
    // create a LineString to mark our gutter
    gutterLineWkt = [
      'LINESTRING(',
        featureWkt[0].split('((')[1],
        featureWkt[1],
        featureWkt[2].split(',')[0],
        ')'
    ].join(' ');

    // make a gutter feature to draw & push to gutterOverlay's feature collection
    var gutterLineGeom = wkt.readGeometry(gutterLineWkt);
    var gutterFeature  = wkt.readFeature(gutterLineWkt);

    // set gutter geometry and key for stylefunction
    gutterFeature.setProperties({
      gutter: gutterLineGeom,
    });
    gutterFeature.setGeometryName('gutter');

    // set drawn geometry and key for stylefunction
    feature.setProperties({
      mount: mountfeature,
    });
    feature.setGeometryName('mount');

    // put the features in the source
    var featureArray = [feature, gutterFeature];
    OlService.setIdsOfFeaturearray(featureArray, featureId);
    gutters.addFeature(gutterFeature);

    // if feature is modified later, be sure to redraw the gutterline
    feature.once('change', OlService.gutterLineFinder);
  };

  return OlService;
}

angular.module('flannel').factory('OlService', OlService_);  
