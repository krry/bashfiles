/* ==================================================
  this factory is a singleton for the Application. 
  
  it provides maps, layers, collections, etc... 

  find Google Map objects on MapService.g....
  find OpenLayer Map objects on MapService.o....

  
  OL Map options are set in these objects
    _ol_control_defaults
    _ol_map_interaction_defaults

================================================== */

function MapService_ ($q, LayerService) {
  var MapService = {};

  MapService.g = {}; // the google map

  MapService.o = {}; // the openlayer map

  MapService.g.mapOptions = {
    zoom : 4,
    minZoom : 4,
    maxZoom : 4,
    mapTypeId : google.maps.MapTypeId.TERRAIN,
    disableDefaultUI: true,
    draggable: false,
    zoomable: false,
    scrollwheel: false,
    backgroundColor: "transparent"
  };

  _ol_map_interaction_defaults = {
    DragRotate: false,
    DoubleClickZoom: false,
    DragPan: false,
    PinchRotate: false,
    PinchZoom: false,
    KeyboardPan: false,
    KeyboardZoom: false,
    MouseWheelZoom: false,
    DragZoom: false,
  };

  _ol_map_control_defaults = {
    attribution: false, 
    zoom:        false, 
    rotate:      false, 
  };

  MapService.g.gmap = null;   // google map
  MapService.g.autocomplete = null;

  function setOmap (options) {  //TODO: move to OlService
    MapService.o.omap = new ol.Map(options);
    return MapService.o.omap;
  };

  MapService.initOmap = function(target_element) {
    var olView = new ol.View({ 
      projection: LayerService.pixelProjection,
      center: ol.extent.getCenter(LayerService.pixelProjection.getExtent()),
      zoom: 1,
    });
    
    var _ol_layers = [
      LayerService.get('area'),
      LayerService.get('static_map'),
      LayerService.get('panel'),
    ];

    var olMapOptions = {
      controls:   [],
      view: olView,
      interactions: [],
      layers: _ol_layers,
      target: target_element,
    };

    return setOmap(olMapOptions);
  }

  MapService.o.layers = null;  

  MapService.getLayer = function(layername) {    //TODO: move to OlService
    if (layername === undefined) {
      return MapService.o.layers;
    } else {
      return MapService.o.layers[layername];
    }
  };

  MapService.getView = function() {  //TODO: move to OlService
    return MapService.o.view;
  };

  MapService.addOverlay = function(layer) {    //TODO: move to OlService
    return MapService.o.omap.addOverlay(layer);
  };

  MapService.setAutocomplete = function(element) {
    MapService.g.autocomplete = new google.maps.places.Autocomplete(element);
    return MapService.g.autocomplete;
  };
  MapService.setSearchBox = function(element) {
    MapService.g.SearchBox = new google.maps.places.SearchBox(element);
    return MapService.g.SearchBox;
  };

  MapService.setGmap = function(element, options) {
    MapService.g.gmap = new google.maps.Map(element, options);
    return MapService.g.gmap;
  };

  MapService.getGmap = function() {
    return MapService.g.gmap;
  };


  MapService.getOmap = function(options) {  //TODO: move to OlService
    return MapService.o.omap;
  };

  MapService.setCenter = function(center) {
    MapService.g.center = center;
    return MapService.g.center;
  };

  MapService.getCenter = function() {
    if (MapService.g.center) {
      return MapService.g.center;
    } else {
      return new google.maps.LatLng(37.483443610459965, -122.2673599891102); //HACK: should only return current map center
      // return null;
    }
  };

  return MapService;
}
angular.module('flannel').factory('MapService', ['$q', 'LayerService', MapService_]);
