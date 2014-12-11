/* ==================================================
  LayerService
  this service provides tools get layers from the map

  show(layer_array) - show a layer, or array of layers
  hide(layer_array) - hide a layer, or array of layers
  get([name])       - get a layer object by name, or an object with all layers
  pixelProjection   - pixel projection

================================================== */
angular.module('flannel').factory('LayerService', ['$window', 'StyleService', LayerService_]);

function LayerService_ ($window, StyleService) {
  var extent,
      pixelProjection,
      service,
      REMOVEMEcenter,
      sources,
      layers;

  service = {
    init          : init,
    show          : show,
    hide          : hide,
    getLayer      : getLayer,
    initOlView    : initOlView,
    getProjection : getProjection,
  };

  // TODO: size map according to the div in which it is loaded, then resize when that div changes size
  // HACK:   dev related
  // TODO:  Extent relates to the size of the map on the user's screen.
  //     *** It's used to convert positions of clicks to positions on a real map. ***
  //         It should update as the screen is resized
  //         In EDLTR, it was always fullscreen.

  REMOVEMEcenter = new google.maps.LatLng(37.4834436, -122.267538);

  function getProjection () {
    return pixelProjection;
  }

  function getSourcesKhak (element) {
    var windowWidth = $window.innerWidth;
    var windowHeight = $window.innerHeight;
    var sources = {
      area: new ol.source.Vector({features: new ol.Collection([])}),
      static_map: new ol.source.ImageStatic({
        // TODO: URL constructor for this
        url: 'http://scexchange.solarcity.com/scfilefactory/TestGrab.aspx?format=jpg&center='+ REMOVEMEcenter.lat()+','+ REMOVEMEcenter.lng() +'&zoom=20&size='+ windowWidth +'x'+ windowWidth +'&maptype=satellite&scale=1&client=gme-solarcity',
        imageSize: [windowWidth, windowHeight],
        projection: pixelProjection,
        imageExtent: pixelProjection.getExtent(),
        visible: true,
      }),
      panel: new ol.source.Vector({features: new ol.Collection([])}),
    };
    return sources;
  }

  function getLayersKhak (sources) {
    var layers = {
      area: new ol.layer.Vector({
        source: sources.area,
        projection: pixelProjection,
        style:  StyleService.defaultStyleFunction,
        name: 'area_layer',
      }),
      static_map: new ol.layer.Image({
        source: sources.static_map,
        name: 'static_map',
      }),
      panel: new ol.layer.Vector({
        source: sources.panel,
        projection: pixelProjection,
        style:  StyleService.defaultStyleFunction,
        name: 'panel_layer',
      }),
    };
    return layers;
  }

  function initOlView (){
    var olView = new ol.View({
      projection: pixelProjection,
      center: ol.extent.getCenter(pixelProjection.getExtent()),
      zoom: 4,
    });
    return olView;
  }

  function init (element) {
    var el = (!element) ? $window : element;
    var header = window.getComputedStyle(document.getElementById('header'), null);
    var el_height = el.innerHeight - parseInt(header.getPropertyValue("height"));
    extent = [0, 0, el.innerWidth, el_height ];
    pixelProjection = new ol.proj.Projection({
      units: 'pixels',
      extent: extent
    });
    sources = getSourcesKhak(element);
    layers = (layers) ? layers : getLayersKhak(sources);

    var _ol_layers = [
      getLayer('static_map'),
      getLayer('area'),
      // getLayer('panel'),
    ];

    return _ol_layers;
  }

  function show (layer_array) {
    // if array, loop on layer_array
    if (Array.isArray(layer_array)) {
      layer_array.forEach(function (layer) {
        layer.setVisible(true);
      });
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
      });
    } else if (typeof(layer_array)=== 'string') {
      // else, hide the single layer
      layer.setVisible(false);
    }
  }

  function getLayer (name) {
    if (name === 'all') return layers;
    return layers[name];
  }

  return service;
}
