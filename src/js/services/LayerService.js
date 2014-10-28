<<<<<<< HEAD
/* ==================================================
  LayerService
  this service provides tools get layers from the map

  show(layer_array) - show a layer, or array of layers
  hide(layer_array) - hide a layer, or array of layers
  get([name])       - get a layer object by name, or an object with all layers
  pixelProjection   - pixel projection

================================================== */
function LayerService_ ($window, StyleService) {
=======
function LayerService_ ($window, StyleService) {
  /* ==================================================
    LayerService 
    this service provides tools get layers from the map

    show(layer_array) - show a layer, or array of layers
    hide(layer_array) - hide a layer, or array of layers
    get([name])       - get a layer object by name, or an object with all layers
    pixelProjection   - pixel projection
    
  ================================================== */
>>>>>>> a333dfc... squash! fix whitespace and tabs/spaces
  var extent = [0, 0, $window.innerWidth, $window.innerHeight ]; // TODO: listen for changes to $window and resize map accordingly.
  var pixelProjection = new ol.proj.Projection({
    units: 'pixels',
    extent: OlService.extent
  });

<<<<<<< HEAD
  var _sources = {
		area: new ol.source.Vector({features: new ol.Collection([])}),
  };

  var layers = {
  	area: new ol.layer.Vector({
	    source: _sources.area, 
	    projection: pixelProjection,
	    style:  StyleService.defaultStyleFunction,
	    name: 'area_layer'
	  }),
  }

	function show(layer_array){
		// if array, loop on layer_array
		if (Array.prototype.isArray(layer_array)) {
			layer_array.forEach(function(layer){
				layer.setVisible(true);
			})		
		} else if (typeof(layer_array)=== 'string') {
			// else, show the single layer
			layer.setVisible(true);
		}
	}
	function hide(layer_array) {
		// if array, loop on layer_array
		if (Array.prototype.isArray(layer_array)) {
			layer_array.forEach(function(layer){
				layer.setVisible(false);
			})		
		} else if (typeof(layer_array)=== 'string') {
			// else, hide the single layer
			layer.setVisible(false);
		}
	}
	function get(name){
		if (name === 'all') return layers;
		return layers[name];
	}
=======
  var service = {
    show   : show,
    hide   : hide,
    get    : get,
    pixelProjection : pixelProjection,
  };

  // HACK:   dev related
  // TODO:  Extent relates to the size of the map on the user's screen.
  //     *** It's used to convert positions of clicks to positions on a real map. ***
  //         It should update as the screen is resized
  //        In EDLTR, it was always fullscreen. 
  var REMOVEMEcenter = new google.maps.LatLng(37.483443610459965, -122.2673599891102)
  //hack: dev

  var _sources = {
    area: new ol.source.Vector({features: new ol.Collection([])}),
    static_map: new ol.source.ImageStatic({ // TODO: URL constructor for this
      url: 'http://scexchange.solarcity.com/scfilefactory/TestGrab.aspx?format=jpg&center='+ REMOVEMEcenter.lat()+','+ REMOVEMEcenter.lng() +'&zoom=20&size='+ $window.innerWidth +'x'+ $window.innerHeight +'&maptype=satellite&scale=1&client=gme-solarcity',
      imageSize: [extent[2], extent[3]],
      projection: pixelProjection,
      imageExtent: pixelProjection.getExtent(),
      visible: true,

    }),
    panel: new ol.source.Vector({features: new ol.Collection([])}),
  };

  var layers = {
    area: new ol.layer.Vector({
      source: _sources.area, 
      projection: pixelProjection,
      style:  StyleService.defaultStyleFunction,
      name: 'area_layer',
    }),
    static_map: new ol.layer.Image({
      source: _sources.static_map,
      name: 'static_map',
    }),
    panel: new ol.layer.Vector({
      source: _sources.panel,
      projection: pixelProjection,
      style:  StyleService.defaultStyleFunction,
      // opacity: 0.6,
      name: 'panel_layer',
    }),
  }

  function show (layer_array) {
    // if array, loop on layer_array
    if (Array.isArray(layer_array)) {
      layer_array.forEach(function (layer) {
        layer.setVisible(true);
      })    
    } else if (typeof(layer_array) === 'string') {
      // else, show the single layer
      layer.setVisible(true);
    }
  }
  function hide (layer_array) {
    // if array, loop on layer_array
    if (Array.isArray(layer_array)) {
      layer_array.forEach(function (layer) {
        layer.setVisible(false);
      })    
    } else if (typeof(layer_array)=== 'string') {
      // else, hide the single layer
      layer.setVisible(false);
    }
  }
  function get (name) {
    if (name === 'all') return layers;
    return layers[name];
  }
>>>>>>> a333dfc... squash! fix whitespace and tabs/spaces

  return service;
}

<<<<<<< HEAD
angular.module('flannel').factory('LayerService', LayerService_);

/*
// the picture we'll display our drawn features on
      var mapCapture = new ol.layer.Image({ //HACK: possible solution for timeout hack 
                                           // is to set this mapCapture inside of the OLService
                                           // instead of in this map. 
        source: new ol.source.ImageStatic({
          url: 'http://scexchange.solarcity.com/scfilefactory/TestGrab.aspx?format=jpg&center='+ MapService.getCenter().lat()+','+ MapService.getCenter().lng() +'&zoom=20&size='+ $window.innerWidth +'x'+ $window.innerHeight +'&maptype=satellite&scale=1&client=gme-solarcity',
          imageSize: [Ol.extent[2], Ol.extent[3]],
          projection: pixelProjection,
          imageExtent: pixelProjection.getExtent()
        }),
      });
      mapCapture.set('name', 'mapCapture');
      // layer for mounts
      var mounts = Ol.mounts;
      var mountLayer = new ol.layer.Vector({
        source: mounts, 
        projection: pixelProjection,
        style:  StyleService.defaultStyleFunction,
      });
      mountLayer.set('name', 'mountLayer');

      // layer for gutters
      var gutters = Ol.gutters;
      var gutterLayer = new ol.layer.Vector({
        source: gutters,
        projection: pixelProjection,
        style:  StyleService.defaultStyleFunction,
      });
      gutterLayer.set('name', 'gutterLayer');

      // layer for obstructions
      var obstructions = Ol.obstructions;
      var obstructionLayer = new ol.layer.Vector({
        source: obstructions, 
        projection: pixelProjection,
        style:  StyleService.defaultStyleFunction,
      });
      obstructionLayer.set('name', 'obstructionLayer');

      // layer for panels
      var panels = Ol.panels;
      var panelLayer = new ol.layer.Vector({
        source: panels, 
        projection: pixelProjection,
        style:  StyleService.defaultStyleFunction,
        opacity: 0.6,
      });
      panelLayer.set('name', 'panelLayer');
      Ol.panelLayer = panelLayer;
      /* pay attention to when there are panels present so the preview button can be styled: 
          this gives us scope.previewPanels -> plan.previewPanels
          there's an ng-class on the previewbutton looking for plan.previewPanels
      */
      /*

      Ol.panels.on('change', function panels(event) {
        var features = event.target.getFeatures();
        scope.previewPanels = features;
      });

      Ol.hideLayers = new ol.layer.Group({
        layers: new ol.Collection([mountLayer, obstructionLayer, gutterLayer])
      });
*/
=======
angular.module('flannel').factory('LayerService', ['$window', 'StyleService', LayerService_]);
>>>>>>> a333dfc... squash! fix whitespace and tabs/spaces
