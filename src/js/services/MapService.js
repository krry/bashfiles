/* ==================================================

  MAPSERVICE

  this factory produces maps, layers, collections

  Google Map objects on `service.g.foo`
  OpenLayer Map objects on `service.o.bar`

  OL Map options are set in these objects
    _ol_control_defaults
    _ol_map_interaction_defaults

================================================== */

angular.module('flannel').factory('MapService', ['$q', 'LayerService', MapService_]);

function MapService_ ($q, LayerService) {

  var DEFAULT_LAT = 30;
  var DEFAULT_LNG = -123;

  var gmapShown = false;
  // var omapShown = false;

  var service = {
    // the google maps object literal
    g: {
      gmap: null,
      autocomplete: null,
      mapOptions: {
          zoom: 4,
          minZoom: 4,
          maxZoom: 4,
          mapTypeId: google.maps.MapTypeId.TERRAIN,
          disableDefaultUI: true,
          draggable: false,
          zoomable: false,
          scrollwheel: false,
          backgroundColor: "transparent"
      },
    },
    // google map methods
    getGmapShown: getGmapShown,
    setGmapShown: setGmapShown,
    getGmap: getGmap,
    setGmap: setGmap,
    getGmapCenter: getGmapCenter,
    setGmapCenter: setGmapCenter,
    updateGmap: updateGmap,
    geocodeAddress: geocodeAddress,
    getGmapMaxZoom: getGmapMaxZoom,
    setAutocomplete: setAutocomplete,
    setGmapSearchBox: setGmapSearchBox,

    // the open layers map object
    o: {},
    // ol map methods
    initOmap: initOmap,
    getOmapShown: getOmapShown,
    setOmapShown: setOmapShown,
    addOverlay: addOverlay,
    getOmap: getOmap,
    setOmap: setOmap,
    setRoofmap: setRoofmap,
    getRoofmap: getRoofmap,
  };

  return service;


  // google maps methods defined

  function getGmapShown () {
    // console.log("getting gmapShown");
    return gmapShown;
  }

  function setGmapShown (value){
    console.log("setting gmapShown to", value);
    gmapShown = value;
    if (value) {
      // HACK: get map to redraw when map shows without a hacky timeout
      setTimeout(function(){
        google.maps.event.trigger(service.g.gmap,'resize');
      }, 1000);
    }
  }

  function reverseGeocode(latlng) {
    var outcome;
    var geocoder = new google.maps.Geocoder();
    geocoder.geocode({'location': latlng}, function(results, status){
      if (status === google.maps.GeocoderStatus.OK) {
        if (results[0]) {
          outcome = results[0].geometry.location;
        }
        else {
          console.error("Error: No known domiciles nearby.");
          outcome = false;
        }
      }
      else {
        console.error("Geocoder failed due to: ", status);
        outcome = false;
      }
    });
    return outcome;
  }

  function geocodeAddress(obj) {
    var outcome;
    var addy = "";
    var geocoder = new google.maps.Geocoder();
    var components = {"country": "US"};
    for (var key in obj) {
      if (obj.hasOwnProperty(key)){
        console.log(key);
        addy = addy + " " + obj[key];
        components[key] = obj[key];
      }
    }

    geocoder.geocode({
      "address": addy,
      "componentRestrictions": components,
    }, function(results, status) {
      if (status === google.maps.GeocoderStatus.OK) {
        if (results[0]) {
          outcome = results[0].geometry.location;
        }
      } else if (status === google.maps.GeocoderStatus.ZERO_RESULTS) {
          console.error("Can't find that location.");
          outcome = false;
      } else if (status === google.maps.GeocoderStatus.OVER_QUERY_LIMIT) {
          setTimeout(function(){ geocodeAddress(obj); }, 200);
      } else if (status === google.maps.GeocoderStatus.REQUEST_DENIED) {
          console.error("The geocoder needs an additional parameter.");
          outcome = false;
      } else {
          if (status === google.maps.GeocoderStatus.INVALID_REQUEST) {
            console.error("The geocode request was invalid. Address or latlng may be missing.");
            outcome = false;
          }
      }
    });
    return outcome;
  }

  function updateGmap(obj) {
    var center;
    // TODO: handle these async calls to Google Maps API with promises
    if (typeof(obj)==="object") {
      if (obj.k && obj.B) {
        // TODO: async promise time
        center = obj;
      } else {
        // TODO: async promise time
        center = geocodeAddress(obj);
      }
    } else {
      console.error("this is not a location object: ", obj);
      return false;
    }
    console.log("updating map, centering on ", center);
    // TODO: figure out why center is not a LatLng object...
    service.g.gmap.setCenter(center);
    console.log(center);
    service.g.gmap.setZoom(getGmapMaxZoom(center));
  }

  function getGmapMaxZoom(latlng) {
    var maxZoomService = new google.maps.MaxZoomService();
    var zoom = service.g.mapOptions.zoom;

    maxZoomService.getMaxZoomAtLatLng(latlng, function(response) {
      if (response.status !== google.maps.MaxZoomStatus.OK) {
        console.log("max zoom status failed");
        zoom = 17;
      } else {
        console.log("max zoom response is " + response.zoom);
        zoom = response.zoom;
      }
    });
    return zoom;
  }

  function setGmap(element, options) {
    service.g.gmap = new google.maps.Map(element, options);
    return service.g.gmap;
  }

  function getGmap() {
    return service.g.gmap;
  }

  function getGmapCenter() {
    if (!service.g.center) {
      // HACK: should only return current map center
      var center = new google.maps.LatLng(DEFAULT_LAT, DEFAULT_LNG);
      service.setGmapCenter(center);
      return center;
    } else {
      return service.g.center;
    }
  }

  function setGmapCenter(center) {
    service.g.center = center;
    return service.g.center;
  }

  function setAutocomplete(element) {
    service.g.autocomplete = new google.maps.places.Autocomplete(element);
    return service.g.autocomplete;
  }
  function setGmapSearchBox(element) {
    service.g.SearchBox = new google.maps.places.SearchBox(element);
    return service.g.SearchBox;
  }

  // OL map functions
  function getOmapShown () {
    // return omapShown;
  }

  function setOmapShown (value){
    // omapShown = value;
  }

  function initOmap(target_element) {
    var olMapOptions = {
      controls: [],
      view: LayerService.initOlView(),
      interactions: [],
      layers: LayerService.init(target_element),
      target: target_element,
    };

    return setOmap(olMapOptions);
  }

  function getOmap(options) {  //TODO: move to OlService
    return service.o.omap;
  }
  function setOmap (options) {  //TODO: move to OlService
    service.o.omap = new ol.Map(options);
    return service.o.omap;
  }
  function getRoofmap() {  //TODO: move to OlService
    return service.o.roofmap;
  }
  function setRoofmap (options) {  //TODO: move to OlService
    service.o.roofmap = new ol.Map(options);
    return service.o.roofmap;
  }

  function addOverlay(layer) {    //TODO: move to OlService
    return service.o.omap.addOverlay(layer);
  }
}
