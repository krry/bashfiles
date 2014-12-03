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

  var gmapShown = false;
  var omapShown = false;

  var MapService = {};
  MapService.g = {}; // the google map

  MapService.o = {}; // the openlayer map

  MapService.getGmapShown = getGmapShown;
  MapService.setGmapShown = setGmapShown;

  MapService.getOmapShown = getOmapShown;
  MapService.setOmapShown = setOmapShown;

  MapService.geocodeAddress = geocodeAddress;

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

  MapService.g.gmap = null;   // google map
  MapService.g.autocomplete = null;

  function setOmap (options) {  //TODO: move to OlService
    MapService.o.omap = new ol.Map(options);
    return MapService.o.omap;
  }

  function getGmapShown () {
    console.log("getting gmapShown");
    return gmapShown;
  }

  function setGmapShown (value){
    console.log("setting gmapShown to", value);
    gmapShown = value;
    if (value) {
      // HACK: get map to redraw when map shows without a hacky timeout
      setTimeout(function(){
        google.maps.event.trigger(MapService.g.gmap,'resize');
      },500);
    }
  }

  function getOmapShown () {
    return omapShown;
  }

  function setOmapShown (value){
    omapShown = value;
  }

  function getGeocoder() {
    var geocoder = new google.maps.Geocoder();
    return geocoder;
  }

  function geocodeAddress(address) {
    var geocoder = getGeocoder();
    geocoder.geocode({'address': address}, function(results, status){
      if (status == google.maps.GeocoderStatus.OK) {
        if (results[0]) {
          // console.log('results of geocode are')
          // console.log(results[0])
          var latlng = results[0].geometry.location;
          return latlng;
        }
        else { 
          console.error("Error: No known domiciles nearby.");
          return false;
        }
      }
      else {
        console.error("Geocoder failed due to: ", status);
        return false;
      }
    });
  }

  function getMaxZoom(latlng) {

  }

  MapService.initOmap = function(target_element) {
    var olView = new ol.View({
      projection: LayerService.pixelProjection,
      center: ol.extent.getCenter(LayerService.pixelProjection.getExtent()),
      zoom: 20,
    });

    var _ol_layers = [
      LayerService.get('static_map'),
      LayerService.get('area'),
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

  MapService.setGmapCenter = function(center) {
    MapService.g.center = center;
    return MapService.g.center;
  };

  MapService.getGmapCenter = function() {
    var latlng = new google.maps.LatLng(30, -123);
    if (MapService.g.center) {
      return MapService.g.center;
    } else {
      console.log('returning default map loc');
      console.log(latlng);
      MapService.setGmapCenter(latlng);
      return latlng;
      // return new google.maps.LatLng(37.483443610459965, -122.2673599891102);
      // HACK: should only return current map center
      // return null;
    }
  };

  return MapService;
}
angular.module('flannel').factory('MapService', ['$q', 'LayerService', MapService_]);
