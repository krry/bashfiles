controllers.controller("MapCtrl", ["$scope", "$firebase", "MapService", "LayerService", "InteractionService", "StyleService", "EventService", "SyncService", "syncData", "updateArea", "addWkt", "firebaseRef", MapCtrl_]);

function MapCtrl_($scope, $firebase, MapService, LayerService, InteractionService, StyleService, EventService, SyncService, syncData, updateArea, addWkt, firebaseRef) {
  var vm = this;

  // TODO: service this
  // wkt allows us to turn feature.getGeometry() into text, text into geometry for
  // use with feature.setGeometry()
  var wkt = new ol.format.WKT();

  // add areas array to the design in firebase
  var designKey = SyncService.get('session_ref').key();
  $scope.areasUrl = SyncService.designObj(designKey).$ref().$parent().path + '/areas'; // hack:

  // firebase ref for all areas
  var design_areas_ref = firebaseRef($scope.areasUrl);

  // save the areas for later reference.... but?
  SyncService.set('areas', design_areas_ref); // is this necessary?

  /********************************************
   listeners on the map
  ********************************************/

  // init the layers for the map
  LayerService.init();

  // listen to firebase for added areas
  design_areas_ref.on('child_added', firebaseListener);
  // listen to map for added areas
  var area_source = LayerService.getLayer('area').getSource();
  // area_source.on('addfeature', sourceListener)

  // listen to draw event
  var draw_interaction = InteractionService.get('draw');
  draw_interaction.on('drawstart', drawStartListen );
  draw_interaction.on('drawend',   drawEndListen );

  function drawStartListen (event) {
    var feature = event.feature;
    console.log('drawing started getting new, empty wkt_ref');
    // get ref for feature
    var wkt_ref = design_areas_ref.push();
    feature.set('wkt_ref_id', wkt_ref.key());
    // save the ref in memory
    SyncService.addSyncRef('areas', wkt_ref);
  }

  function updateWhileModify (event) {
    var feature = event.target;
    var wkt_txt = wkt.writeGeometry(feature.getGeometry());
    var wkt_ref_id = feature.get('wkt_ref_id');
    var wkt_ref = SyncService.getSyncRef('areas', wkt_ref_id);
    wkt_ref.set(wkt_txt);
    // if (wkt_ref.val() !== wkt_txt) {
    //   console.log('updating area after draw')
    //   wkt_ref.set(wkt_txt);
    // }
  }

  // handle added areas on the map
  function drawEndListen (event) {
    // get the added feature
    var feature = event.feature;
    console.log('we finished drawing');
    // get ref for feature
    var wkt_ref_id = feature.get('wkt_ref_id');
    var wkt_ref = SyncService.getSyncRef('areas', wkt_ref_id);
    addToFirebaseAfterDraw(feature);
    // listen for changes later
    feature.on('change', updateWhileModify );
  }

  // handle areas added to firebase
  function firebaseListener (child_ref) {
    console.log('firebaseListener heard a feature get added');
    var wkt_ref_id = child_ref.key();
    var wkt_ref = SyncService.getSyncRef('areas', wkt_ref_id);
    if ( child_ref.val() === 'start_only') {
      console.log('but we will not add because only start');
      wkt_ref.ref().on('value', changeAreaFromFirebase);
    } else if (!wkt_ref) {
      console.log('it is new, so we sent it to the map');
      // the area doesn't exist yet, should be drawn
      addAreaFromFirebase(child_ref);
    } else {
      // the area exists, don't do shit
      console.log('that area exists already');
    }
  }

  /********************************************
   handle firebase updates
  ********************************************/

  // add feature to source
  function addAreaFromFirebase (ref) {
    var new_geom;
    var new_feat;
    console.log('now adding area from firebase');
    var new_wkt = ref.val();
    console.log('new_wkt', new_wkt);
    if (new_wkt !== 'start_only') {
      new_geom = wkt.readGeometry(new_wkt);
      new_feat = wkt.readFeature(new_wkt);

      // set the feature's area property, which are read later by the Style function
      new_feat.set('area', new_geom);
      new_feat.setGeometryName('area');
      // save the ref_key
      new_feat.set('wkt_ref_id', ref.key());
      // add area to map
      LayerService.getLayer('area').getSource().addFeature(new_feat);
      // listen for changes on the ref
      ref.ref().on('value', changeAreaFromFirebase);
      new_feat.on('change', updateWhileModify );
      SyncService.addSyncRef('areas', ref.ref());
    } else {
      console.log('we are still drawing');
    }
  }

  function changeAreaFromFirebase (wkt_ref) {
    var new_wkt    = wkt_ref.val();
    var wkt_ref_id = wkt_ref.key();
    var area       = findFeatureByWktId(wkt_ref_id);
    var curr_wkt   = wkt.writeGeometry(area.getGeometry());
    // meaningful change?
    if (new_wkt === 'start_only') {
      console.log("we're still drawing");
    } else if (curr_wkt === new_wkt) {
      console.log('this area has not changed');
    } else {
      // change feature
      console.log('this area was changed by firebase');
      var new_geom = wkt.readGeometry(new_wkt);
      area.setGeometry(new_geom);
    }
  }

  function findFeatureByWktId (wkt_ref_id) {
    var areas = area_source.getFeatures();
    var result;
    for (var i = 0; i < areas.length; i++) {
      if (areas[i].get('wkt_ref_id') === wkt_ref_id) {
        result = areas[i];
      }
    }
    return result;
  }

  /********************************************
   handle source updates
  ********************************************/

  // update from client
  function addToFirebaseAfterDraw (area) {
    console.log('now adding to firebase with new area');
    // get the area's wkt_txt
    var wkt_txt = wkt.writeGeometry(area.getGeometry());
    // send the new wkt_txt to firebase
    var wkt_ref = SyncService.getSyncRef('areas', area.get('wkt_ref_id'));
    wkt_ref.set(wkt_txt);
    wkt_ref.on('value', changeAreaFromFirebase );
  }

  function addFeatureIfNecessary (area, wkt_ref) {
    // get current wkt_txt
    var wkt_txt = wkt.writeGeometry(area.getGeometry());
    var new_wkt = wkt_ref.val();
    var new_geom;
    if (new_wkt !== wkt_txt ) {
      // changed feature, update it
      console.log('changeing feature to match update from firebase');
      new_geom = wkt.readGeometry(new_wkt);
      area.setGeometry(new_geom);
    } else {
      // no change, don't do shit
      console.log('feature matches firebase');
    }
  }
}
