/* ==================================================

  MapService

  this factory produces maps, layers, collections

  Google Map objects on `service.g.foo`
  OpenLayer Map objects on `service.o.bar`

  OL Map options are set in these objects:
    _ol_control_defaults
    _ol_map_interaction_defaults

================================================== */

angular.module('flannel').factory('MapService', ['$q', 'Clientstream', 'Geocoder', 'LayerService', 'StyleService', 'UserService', 'Configurator', MapService_]);

function MapService_ ($q, Client, Geocoder, LayerService, StyleService, UserService, Configurator) {

  var DEFAULT_LAT = 30;
  var DEFAULT_LNG = -123;

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

  // TODO: blast this monkeytree into pieces
  var service = {
    // the google maps object literal
    g: {
      center: "",
      gmap: null,
      autocomplete: null,
      mapOptions: gmapOptions,
    },

    // google map methods
    getGmap: getGmap,
    setGmap: setGmap,
    getGmapCenter: getGmapCenter,
    setGmapCenter: setGmapCenter,
    updateMap: updateMap,
    setZoom: setZoom,
    getGmapMaxZoom: getGmapMaxZoom,
    setAutocomplete: setAutocomplete,
    setGmapSearchBox: setGmapSearchBox,

    // the open layers map object
    o: {},
    // ol map methods
    initOmap: initOmap,
    addOverlay: addOverlay,
    getOmap: getOmap,
    setOmap: setOmap,
    setRoofmap: setRoofmap,
    getRoofmap: getRoofmap,
  };

  Client.listen('zoom found', setZoom);

  return service;

  // send a latLng, get back an address
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

  // given a location, update the map to center on it, and max zoom to it
  // TODO: nix the silly `service.g.gmap` object naming
  function updateMap (location) {
    if (typeof(location) !== "object") {
      console.error("not a location object, cannot update map with:", location);
      return false;
    }
    console.log("updating map to center on:", location);
    service.g.gmap.setCenter(location);
    return getGmapMaxZoom(location);
  }

  // ask for its maximum imagery zoom at a given location
  function getGmapMaxZoom(location) {
    var zoom,
        latLng,
        maxZoomService;

    zoom = service.g.gmap.getZoom();
    console.log('old zoom level:', zoom);

    // handle case where .lng & .lng() differ.
    if (typeof location.lng === "function") {
      latLng = new google.maps.LatLng(location.lat(), location.lng());
    } else {
      latLng = new google.maps.LatLng(location.lat, location.lng);
    }
    console.log('latlng', latLng);

    maxZoomService = new google.maps.MaxZoomService();

    maxZoomService.getMaxZoomAtLatLng(latLng, function(response) {
      if (response.status !== google.maps.MaxZoomStatus.OK) {
        console.log("max zoom failed:", response.status);
        // HACK: hardcode fallback when zoom ain't
        Client.emit('zoom found', 17);
      } else {
        console.log("max zoom at location:", response.zoom);
        Client.emit('zoom found', response.zoom);
      }
    });
  }

  // TODO: nix that service.g crap here too
  function setZoom (zoom) {
    console.log('setting zoom to:', zoom);
    service.g.gmap.setZoom(zoom);
    console.log('zoom set to:', service.g.gmap.getZoom());
  }

  // drop a pin on the map center
  function dropPin(addy, res) {
    var marker;

    if(typeof(marker)!=="undefined") {
      console.log('already a pin')
      marker.setMap(null);
      marker = null;
    }
    if (addy.street !== ""){
      console.log("dropping new pin on addy " + addy);
      marker = new google.maps.Marker({
        position: addy.latlng,
        map: service.g.gmap,
        zoom: addy.zoom,
        draggable: true,
        icon: 'img/burstpin.png'
      });
    }
  }

  function setGmap(element, options) {
    // TODO: add a safety check to avoid overwriting existing maps
    service.g.gmap = new google.maps.Map(element, options);
    return service.g.gmap;
  }

  function getGmap() {
    var map = (!service.g.map) ? false : service.g.gmap;
    return map;
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
