controllers.controller("GmapCtrl", ["$scope", "$element", "Clientstream", "Geocoder", "Gmap", "MapService", "NearMe", GmapCtrl_]);

function GmapCtrl_ ($scope, $element, Client, Geocoder, Gmap, MapService, NearMe) {

  var vm,
      center,
      zoom,
      map,
      mapEl,
      mapOpts,
      spinnerEventCount;

  vm = this;

  // default the gmap to hidden so it doesn't peek from behind other divs
  vm.shown = false;

  // expose autolocate function to the directives
  vm.autolocate = autolocate;

  mapEl = $element[0];
  mapOpts = Gmap.opts;
  spinnerEventCount = 0;

  // once window loads, activate map using defaults
  google.maps.event.addDomListenerOnce(window, "load", activate);

  // stream listeners
  Client.listen('center changed', applyCenter);
  Client.listen('Gmap: max zoom found', applyMaxZoom);
  Client.listen('Gmap: switch to satellite', switchToSatellite);
  Client.listen('Spinner: add to spin count', setSpinCount);
  // Client.listen('Gmap: get nearme data', getNearMeData);

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
  }

  function setSpinCount(data) {
    spinnerEventCount += data ? 1 : -1;
    console.log('spin event count is', spinnerEventCount);
  }

  function hideSpinner () {
    console.log('hiding spinner');
    // TODO: ensure that the spinner stays up until the tiles are actually loaded
    // switching from TERRAIN to HYBRID map causes an extra `tilesloaded` event to be emitted, prematurely hiding the spinner for the HYBRID map load
    Client.emit('Spinner: spin it', false);
    if (spinnerEventCount < 1) {
      if (spinnerEventCount < 0) spinnerEventCount = 0;
      console.log('spinner counter', spinnerEventCount);
    }
  }

  function switchToSatellite (data) {
    Gmap.loaded.then(function() {
      if (data && map.getMapTypeId() !== "hybrid") {
        Client.emit('Spinner: add to spin count', true);
        map.setMapTypeId(google.maps.MapTypeId.HYBRID);
      }
    });
  }

  function saveCenter () {
    // TODO: wait to fire these updates until mouseup to avoid oversyncing and lag induction
    // if ($element.mouseUp()) {
      if (map.getCenter() !== center){
        center = map.getCenter();
        // saving center of gmap
        Client.emit('center changed', center);
      }
    // }
  }

  function applyCenter (location) {
    if (location !== center) {
      // applying location as center of gmap
      if (!vm.shown) {
        vm.shown = true;
      }
      Gmap.loaded.then(function() {
        map.setCenter(location);
      });
    } else return false;
  }

  function saveZoom () {
    Gmap.loaded.then(function() {
      var zoom = map.getZoom();
      console.log('saving zoom as', zoom);
      if (mapOpts.zoom !== zoom){
        mapOpts.zoom = zoom;
      }
    });
  }

  function applyMaxZoom (zoom) {
    Gmap.loaded.then(function() {
      console.log('setting zoom to', zoom);
      map.setZoom(zoom);
      mapOpts.zoom = zoom;
      // TODO: prevent nearme call when advancing from checkZip to checkAddress directly
      if (zoom < 17 && zoom > 4) getNearMeData();
    });
  }

  function getNearMeData(data, count) {
    count = count || 1;

    // Reset the view state while we are still getting the data
    // This prevents old data from lingering in the view while we're processing the new location
    Client.emit('neighbor_count saved', 0);
    Client.emit('Form: final near me data', false);

    return Gmap.loaded.then(function() {
      // get nearme data for the current map's bounding box
      var bounds = map.getBounds(),
          ne,
          sw,
          area,
          coords;

      // Bounds can be undefined even if the map is loaded but the tiles are not
      /* jshint eqnull:true */
      if (bounds == null) {
        return;
      }

      ne = bounds.getNorthEast();
      sw = bounds.getSouthWest();

      // use NE and SW corners of map to set bounding box coordinates
      coords = {
        top: ne.lat(),
        right: ne.lng(),
        bottom: sw.lat(),
        left: sw.lng()
      };

      // safeguard against loading too large of an area
      area = Math.abs(coords.top - coords.bottom) * Math.abs(coords.left - coords.right);
      if (area > 0.8) {
        // If can't get a larger area, just plot what we have from the last call
        return plotMarkers(data, count);
      }

      // send the coordinates to NearMe, then check if there are enough, then plot the pins if so
      return NearMe.get(coords).then(getEnoughPins).then(function(data) {
        plotMarkers(data, count);
      });
    });
  }

  function getEnoughPins(data) {
    if (data.length >= 250) {
      return data;
    } else {
      map.setZoom(map.getZoom() - 1);
      return;
    }
  }

  function plotMarkers(data, count) {
    var maxCount = 10,
        opts;

    if (!data && (count < maxCount)) {
      getNearMeData(data, ++count);
    } else {
      data = data || [];
      // clear any old pins from the map
      Client.emit('clear pins', true);

      // parse the JSON response from NearMe API
      angular.forEach(data, function(point) {
        // for each object in the response send the location and content to
        opts = {
          location: new google.maps.LatLng(point.la, point.ln),
          content: point.kw + ' kW system'
        };

        // ask GmapProvider to make and drop a new pin
        Client.emit('Gmap: drop pin', opts);
      });

      // let the view model know how many pins were found
      Client.emit('neighbor_count saved', data.length);

      if (count >= maxCount) {
        Client.emit('Form: final near me data', true);
      }
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
