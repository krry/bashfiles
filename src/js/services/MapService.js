function MapService_ ($q) {
  // this factory is a singleton for the Application. 
  // it provides maps, layers, collections, etc... 
  var MapService = {};
  
  // the google map
  MapService.g = {};
  // the openlayer map
  MapService.o = {};

  MapService.g.mapOptions = { 
    disableDefaultUI: true,
    keyboardShortcuts: false,
    draggable: true,
    disableDoubleClickZoom: false,
    scrollwheel: true,
    streetViewControl: false,
    // center: new google.maps.LatLng(37.5516671,-122.31563), //TODO: device location
    zoom: 20,
    mapTypeId: google.maps.MapTypeId.SATELLITE, 
    tilt: 0, 
    rotateControl: true,
    mapTypeControl: false,
    // zoomControl: true,
    zoomControlOptions: {
      style: google.maps.ZoomControlStyle.SMALL
    }
  };

  // MapService.o.staticMap = null;  
  MapService.o.staticMap = null;  

  // google map
  MapService.g.gmap = null;
  MapService.g.autocomplete = null;

  // openlayer map
  MapService.o.omap = null;
  MapService.o.view = null; 

  MapService.o.layers = null;  

  // group methods
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

  MapService.setOmap = function(options) {  //TODO: move to OlService

    MapService.o.omap = new ol.Map(options);
    return MapService.o.omap;
  };

  MapService.getOmap = function(options) {  //TODO: move to OlService
    return MapService.o.omap;
  };

  MapService.setOview = function(view) {  //TODO: move to OlService
    MapService.o.view = view;
    return MapService.o.view;
  };

  MapService.getOview = function() {   //TODO: move to OlService
    return MapService.o.view;
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

  MapService.setStatic = function (ele) {    //TODO: move to OlService (maybe)
    var element = document.getElementById('gmap'); //HACK: this should be a parameter
    var defer = $q.defer();
    MapService.o.staticMap = defer.promise;
    html2canvas(element, {
      useCORS: true,
      onrendered: function(canvas) {
        var dataUrl= canvas.toDataURL("image/png");
        defer.resolve(dataUrl);
      }
    });
    return MapService.o.staticMap;
  };

  MapService.getStatic = function() {    //TODO: move to OlService
    var defer = $q.defer();
    if (MapService.o.staticMap) {
      console.log('staticMap');
      defer.resolve(MapService.o.staticMap);
    } else { // HACK: this here for development only
      console.log('staticHack')
      defer.resolve('img/de_haro_test_image.PNG');
    }
    return defer.promise;
  };

  return MapService;
}
angular.module('edliter').factory('MapService', MapService_);  
