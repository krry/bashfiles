controllers.controller("GoogleMapCtrl", ["$scope", "$element", "MapService", "UserService", GoogleMapCtrl_]);

function GoogleMapCtrl_($scope, $element, MapService, UserService) {
  var vm = this;

  vm.gmapShown = MapService.getGmapShown;

  var mapOptions,
      map,
      input,
      searchbox;

  mapOptions = MapService.g.mapOptions;
  map = MapService.setGmap($element[0], mapOptions);

  google.maps.event.addDomListener(window, "load", activate);

  function activate(){
    // create an Autocompleting search box on the map
    input = document.getElementById('hood_check');
    // map.controls[google.maps.ControlPosition.BOTTOM_LEFT].push(input);
    searchbox = MapService.setGmapSearchBox(input);
    // searchbox.bindTo('bounds', map);
    // listen for the 'place_changed' trigger which is fired
    google.maps.event.addListener(searchbox, 'place_changed', parsePlace);
    MapService.updateGmap(MapService.getGmapCenter(), catchMapActivationResult);
    google.maps.event.addListener(map, 'center_changed', saveCenter);
  }

  function catchMapActivationResult (result) {
    return result;
  }

  function parsePlace(place){
    // get the place you clicked on
    if (!place.geometry) {
      return;
    }
    // If the place has a geometry, then present it on the map.
    if (place.geometry.viewport) {
      map.fitBounds(place.geometry.viewport);
    } else {
      map.setCenter(place.geometry.location);
    }
    if (place.address_components) {
      parsePlaceAddress(place);
    }
  }

  function parsePlaceAddress(place) {
    var address = '';
    address = [
      (place.address_components[0] && place.address_components[0].short_name || ''),
      (place.address_components[1] && place.address_components[1].short_name || ''),
      (place.address_components[2] && place.address_components[2].short_name || '')
    ].join(' ');
    UserService.setAddress(place.formatted_address);
  }

  // always save the mapcenter when it's changed.
  function saveCenter () {
    var center = map.getCenter();
    if (center) {
      // this is what was blowing everything up, don't know exactly why
      // MapService.setCenter(center);
      MapService.setGmapCenter(center);
    }
  }

  function setGmapZoom(zoom) {
    mapOptions.zoom = zoom;
  }
}
