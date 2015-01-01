/* ==================================================

  MapService

  this factory produces maps, layers, collections

  Google Map objects on `service.g.foo`
  OpenLayer Map objects on `service.o.bar`

  OL Map options are set in these objects
    _ol_control_defaults
    _ol_map_interaction_defaults

================================================== */

angular.module('flannel').factory('MapService', ['$q', 'LayerService', 'StyleService', 'UserService', 'Configurator', MapService_]);

function MapService_ ($q, LayerService, StyleService, UserService, Configurator) {

  var DEFAULT_LAT = 30;
  var DEFAULT_LNG = -123;

  var gmapShown = false;
  var maxZoomService = new google.maps.MaxZoomService();
  // var omapShown = false;

  var gmapOptions = {
    zoom: 4,
    minZoom: 4,
    mapTypeId: google.maps.MapTypeId.TERRAIN,
    disableDefaultUI: true,
    // draggable: false,
    // zoomable: false,
    // scrollwheel: false,
    backgroundColor: "transparent"
  };

  var service = {
    // the google maps object literal
    g: {
      center: "",
      gmap: null,
      autocomplete: null,
      mapOptions: gmapOptions,
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
    console.log("getting gmapShown", gmapShown);
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

  function reverseGeocode(latLng) {
    var outcome;
    var geocoder = new google.maps.Geocoder();
    geocoder.geocode({'location': latLng}, function(results, status){
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

    function updateGmap(obj, cb) {
      var center;
      console.log('updating gmap', obj);
      if (typeof(obj)==="object") {
        if (obj.lat() && obj.lng()) {
          console.log('object passed to updateGmap');
          if ( typeof obj.lat !== "function" ) {
            console.log('location being geocoded');
            geocodeAddress(obj, function(response) {
              if (typeof response.lat !== "function") {
                return response;
              } else {
                center = {
                  lat: response.lat(),
                  lng: response.lng()
                };
                service.g.gmap.setCenter(center);
                getGmapMaxZoom(center, function(zoom) {
                  service.g.gmap.setZoom(zoom);
                  recenterMap(center);
                  return cb(true);
                });
              }
            });
          } else {
            center = obj;
            console.log('lat:', obj.lat(), ', lng:', obj.lng());
            service.g.gmap.setCenter(center);
            service.g.gmap.setZoom(getGmapMaxZoom(center, function(zoom) {
              service.g.gmap.setZoom(zoom);
              recenterMap(center);
              return cb(true);
            }));
          }
        } else {
          console.error("this is not a location object: ", obj);
          return cb(false);
        }

  function geocodeAddress(obj, cb) {
    var outcome;
    var addy = "";
    var geocoder = new google.maps.Geocoder();
    var components = {"country": "US"};
    for (var key in obj) {
      if (obj.hasOwnProperty(key)){
        console.log("appending", key,"to addy string");
        if (addy.length === 0) {
          addy = obj[key];
        } else {
          addy = addy + " " + obj[key];
        }
        components[key] = obj[key];
      }
    }
    console.log("components are", components);

    geocoder.geocode({
      "address": addy,
      "componentRestrictions": components,
    }, function(results, status) {
      if (status === google.maps.GeocoderStatus.OK) {
        if (results[0]) {
          outcome = results[0].geometry.location;
          console.log('geocode successful', results);
          var addy = parseLocation(results[0]);
          UserService.setHome('city', addy.city);
          UserService.setHome('state', addy.state);
          UserService.setHome('zip', addy.zip);
          return cb(outcome);
        }
      } else if (status === google.maps.GeocoderStatus.ZERO_RESULTS) {
          console.error("Can't find that location.");
          outcome = false;
          return cb(outcome);
      } else if (status === google.maps.GeocoderStatus.OVER_QUERY_LIMIT) {
          console.error("over query limit, retrying...");
          setTimeout(function(){ geocodeAddress(obj, cb); }, 200);
      } else if (status === google.maps.GeocoderStatus.REQUEST_DENIED) {
          console.error("The geocoder needs an additional parameter.");
          outcome = false;
          return cb(outcome);
      } else {
          if (status === google.maps.GeocoderStatus.INVALID_REQUEST) {
            console.error("The geocode request was invalid. Address or latLng may be missing.");
            outcome = false;
            return cb(outcome);
          }
      }
    });
    // return cb(outcome);
  }

  // send results to parseLocation from geocodeAddress
  function parseLocation(results, response) {
    var addy = {};
    console.log('parsing address', results.address_components);
    var parsedress = results.address_components
    // iterate through the array of address_components
    for (var i=0; i<parsedress.length; i++) {
      if (parsedress[i].types[0]==="postal_code") {
        if (typeof(parsedress[i].long_name) !== "undefined") {
          addy.zip = parsedress[i].long_name
      }}
      if (parsedress[i].types[0]==="administrative_area_level_1") {
        if (typeof(parsedress[i].short_name) !== "undefined") {
          addy.state = parsedress[i].short_name
      }}
      if (parsedress[i].types[0]==="locality") {
        if (typeof(parsedress[i].long_name) !== "undefined") {
          addy.city = parsedress[i].long_name
      }}
      if (parsedress[i].types[0]==="route") {
        if (typeof(parsedress[i].short_name) !== "undefined") {
          addy.street = parsedress[i].short_name
      }}
      if (parsedress[i].types[0]==="street_number") {
        if (typeof(parsedress[i].long_name) !== "undefined") {
          addy.stno = parsedress[i].long_name
      }}
      if (parsedress[i].types[0] === "country" ? typeof parsedress[i].short_name !== "undefined" : void 0) {
        addy.country = parsedress[i].short_name
      }
    }
    if (typeof(addy.street)!=="undefined" && typeof(addy.stno)!=="undefined") {
      addy.home = addy.stno + " " + addy.street
      console.log("street address is: ")
      console.log(addy.home)
    }

    // return values of address components to be saved in form fields
    if (addy.country !== 'US') {
      return response(false, "Invalid ZIP code")
    } else if (addy.zip) {
      console.log("returning addy: ")
      console.log(addy)
      // return response(true, "Address found", addy)
      return addy;
    }
  }

  function recenterMap(center) {
    console.log("updating map, centering on ", center);
    service.g.gmap.setCenter(center);
    // update the OL MAP view's center.
    console.log('setting center to', center);
    getGmapMaxZoom(center, function (zoom) {
      service.g.gmap.setZoom(zoom);
    });
  }

  function getGmapMaxZoom(latLng, cb) {
    var zoom = service.g.mapOptions.zoom;
    console.log('max zooming', zoom);
    maxZoomService.getMaxZoomAtLatLng(latLng, function(response) {
      if (response.status !== google.maps.MaxZoomStatus.OK) {
        console.log("max zoom status failed");
        zoom = 17;
        return cb(zoom);
      } else {
        console.log("max zoom response is " + response.zoom);
        zoom = response.zoom;
        return cb(zoom);
      }
    });
    // return zoom;
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
      console.log("map center not set, defaulting to:", center);
      service.setGmapCenter(center);
      return center;
    } else {
      return service.g.center;
    }
  }

  function setGmapCenter(center) {
    service.g.center = center;
    Configurator.view().setCenter([center.lat(), center.lng()])
    console.log('setting center', Configurator.view().getCenter());
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
      controls: ol.control.defaults({
            zoom: true,
            attribution: false,
            rotate: false,
          }),
      view: LayerService.initOlView(),
      // interactions: ol.interaction.defaults,
      // layers: LayerService.init(target_element),
      // overlays: [new ol.FeatureOverlay({
      //         style: StyleService.defaultStyleFunction,
      //         name: 'area_layer',
      //       })],
      target: target_element,
    };

    return setOmap(Configurator.map(target_element));
    // return setOmap(olMapOptions);
  }

  function getOmap(options) {  //TODO: move to OlService
    return service.o.omap;
  }
  function setOmap (options) {  //TODO: move to OlService
    service.o.omap = new ol.Map(options);

    // LayerService.getDrawLayer().setMap(service.o.omap);
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
