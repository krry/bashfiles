controllers.controller("GmapCtrl", ["$scope", "$element", "Geocoder", GmapCtrl_]);

function GmapCtrl_ ($scope, $element, Geocoder) {

  var DEFAULT_CENTER,
      center,
      zoom,
      map,
      mapEl,
      mapOptions;

  // TODO: get default center from MapFactory
  DEFAULT_CENTER = {
    LAT: 30,
    LNG: -123,
  };

  mapEl = $element[0];

  // TODO: get default mapOptions from MapFactory
  mapOptions = {
    zoom: 4,
    minZoom: 4,
    mapTypeId: google.maps.MapTypeId.TERRAIN,
    disableDefaultUI: true,
    // draggable: false,
    // zoomable: false,
    // scrollwheel: false,
    backgroundColor: "transparent",
  }

  // once window loads, activate map using defaults
  google.maps.event.addDomListenerOnce(window, "load", activate);

  // when user enters a valid, inTerritory zipcode, center the map and zoom to 15

  function init (element, options) {
    map = new google.maps.Map(element, options);
  }

  function activate () {
    // init the map object with defaults
    init(mapEl, mapOptions);
    // listen to the map for user's changes
    listenToCenter();
    listenToZoom();
  }

  function listenToCenter () {
    google.maps.event.addListener(map, 'center_changed', saveCenter);
  }

  function listenToZoom () {
    google.maps.event.addListener(map, 'zoom_changed', saveZoom);
  }

  function saveCenter () {
    center = map.getCenter();
    if (center) {
      Map.setCenter(center);
    }
  }

  function saveZoom () {
    zoom = map.getZoom();
    if (zoom) {
      Map.setZoom(zoom);
    }
  }
}
