controllers.controller("GmapCtrl", ["$scope", "$element", "Clientstream", "Geocoder", "Gmap", "MapService", GmapCtrl_]);

function GmapCtrl_ ($scope, $element, Client, Geocoder, Gmap, MapService) {

  var vm,
      center,
      zoom,
      map,
      mapEl,
      mapOpts;

  vm = this;
  vm.shown = false;
  vm.autolocate = autolocate;

  mapEl = $element[0];
  mapOpts = Gmap.opts;

  // once window loads, activate map using defaults
  google.maps.event.addDomListenerOnce(window, "load", activate);

  // stream listeners
  // Client.listen('gmap shown', showMap);
  Client.listen('center changed', applyCenter);
  Client.listen('max zoom found', applyMaxZoom);
  Client.listen('valid territory', checkMapVisibility);
  Client.listen('Gmap: switch to satellite', switchToSatellite);

  function init (el) {
    map = Gmap.init(el);
  }

  function activate () {
    // init the map object with defaults
    init(mapEl, mapOpts);
    // listen to the map for user's changes
    listenToCenter();
    listenToZoom();
    listenForMapFinish();
  }

  function listenToCenter () {
    google.maps.event.addListener(map, 'center_changed', saveCenter);
  }

  function listenToZoom () {
    google.maps.event.addListener(map, 'zoom_changed', saveZoom);
  }

  function listenForMapFinish () {
    google.maps.event.addListener(map, 'tilesloaded', hideSpinner);
    google.maps.event.addListener(map, 'idle', hideSpinner);
  }

  function hideSpinner () {
    Client.emit('spin it', false);
  }

  function switchToSatellite (data) {
    if (data && map.getMapTypeId() !== "hybrid") {
      map.setMapTypeId(google.maps.MapTypeId.HYBRID);
      // Gmap.checkMaxZoom()
    }
  }

  function saveCenter () {
    // TODO: wait to fire these updates until mouseup to avoid oversyncing and lag induction
    // if ($element.mouseUp()) {
      if (map.getCenter() !== center){
        center = map.getCenter();
        console.log('saving center', center);
        Client.emit('center changed', center);
      }
    // }
  }

  function applyCenter (location) {
    if (location !== center) {
      console.log('applying center', location);
      map.setCenter(location);
      // Client.emit('center changed', location);
    } else return false;
  }

  function saveZoom () {
    var zoom = map.getZoom();
    console.log('saving zoom as', zoom);
    if (mapOpts.zoom !== zoom){
      mapOpts.zoom = zoom;
    }
  }

  function applyMaxZoom (zoom) {
    console.log('setting zoom to', zoom);
    map.setZoom(zoom);
  }

  function checkMapVisibility (data) {
    if (!vm.shown) {
      vm.shown = true;
    }
  }

  function autolocate () {
    var location;
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(function(position){
        location = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
        vm.shown = true;
        applyCenter(location);
      });
    }
  }
}
