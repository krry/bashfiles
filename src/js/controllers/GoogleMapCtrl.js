controllers.controller("GoogleMapCtrl", ["$scope", "$element", "Clientstream", "MapService", "UserService", GoogleMapCtrl_]);

function GoogleMapCtrl_($scope, $element, Client, MapService, UserService) {
  var vm = this;

  var mapOptions,
      map,
      input,
      searchbox;

  vm.gmapShown = false;

  Client.listen('gmap shown', showGmap);
  mapOptions = MapService.g.mapOptions;
  map = MapService.setGmap($element[0], mapOptions);

  // TODO: remove searchbox functionality from zip field
  google.maps.event.addDomListener(window, "load", activate);

  function showGmap (data) {
    vm.gmapShown = data;
  }

  function activate(){
    // create an Autocompleting search box on the map
    // input = document.getElementById('hood_check');
    // map.controls[google.maps.ControlPosition.BOTTOM_LEFT].push(input);
    // searchbox = MapService.setGmapSearchBox(input);
    // searchbox.bindTo('bounds', map);
    // listen for the 'place_changed' trigger which is fired
    // google.maps.event.addListener(searchbox, 'place_changed', parsePlace);
    MapService.updateMap(MapService.getGmapCenter());
    google.maps.event.addListener(map, 'center_changed', saveCenter);
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

  // TODO: decide whether map should adjust its center based on the DOM
  // function map_recenter(latlng) {
  //   var offsetX = 0;
  //   var offsetY = $('.overlayer').height() / 2;
  //   var point1 = map.getProjection().fromLatLngToPoint(
  //       (latlng instanceof google.maps.LatLng) ? latlng : map.getCenter()
  //   );
  //   var point2 = new google.maps.Point(
  //       ( (typeof(offsetx) == 'number' ? offsetX : 0) / Math.pow(2, map.getZoom()) ) || 0,
  //       ( (typeof(offsety) == 'number' ? offsetY : 0) / Math.pow(2, map.getZoom()) ) || 0
  //   );
  //   map.setCenter(map.getProjection().fromPointToLatLng(new google.maps.Point(
  //       point1.x - point2.x,
  //       point1.y + point2.y
  //   )));
  // }

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
