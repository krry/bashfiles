function edlGoogleMap($timeout, $document, $window, MapService) {
  return {
    restrict: "A",
    transclude: true,
    scope: {
    	onCreate: "&"
    },
    controller: function edlGoogleMapController($scope, $element, $attrs) {

    },
    link: function edlGoogleMapLink(scope, ele, attrs) {
      var mapOptions,
          map,
          input,
          searchbox,
          center,
          pacItems,
          saveCenter;

      mapOptions = MapService.g.mapOptions;

      map = MapService.setGmap(ele[0], mapOptions);

      // create an Autocompleting search box on the map
      input = document.getElementById('hood_check');

      map.controls[google.maps.ControlPosition.BOTTOM_LEFT].push(input);

      searchbox = MapService.setSearchBox(input);
      searchbox.bindTo('bounds', map);

      // listen for the 'place_changed' trigger which is fired 
      google.maps.event.addListener(searchbox, 'place_changed', function(place){
        // get the place you clicked on
        if (!place.geometry) {
          return;
        }
        // If the place has a geometry then present it on the map.
        if (place.geometry.viewport) {
          map.fitBounds(place.geometry.viewport);
        } else {
          map.setCenter(place.geometry.location);
        }

        var address = '';
        if (place.address_components) {
          address = [
            (place.address_components[0] && place.address_components[0].short_name || ''),
            (place.address_components[1] && place.address_components[1].short_name || ''),
            (place.address_components[2] && place.address_components[2].short_name || '')
          ].join(' ');
        }
        document.getElementById('pac-input').val(place.formatted_address);
      });
      center =  MapService.getCenter();
      map.setCenter(center);
      map.setZoom(20);

      // always save the mapcenter when it's changed. 
      saveCenter = function saveCenter () {
        var center = map.getCenter();
        if (center) {
          MapService.setCenter(center);
        }
      };
      google.maps.event.addListener(map, 'center_changed', saveCenter);

      // use the contents of the Autocomplete to ask Maps for the specific map location
      pacItems = document.querySelectorAll('.pac-item');

      if ('addEventListener' in window && pacItems.length > 0) {
        pacItems.addEventListener('touchend', touch_or_click_callback);
        pacItems.addEventListener('mousedown', touch_or_click_callback);
      }
          function callback(results, status) {
            if (status == google.maps.places.PlacesServiceStatus.OK) {
              console.log('triggered');
              google.maps.event.trigger(searchbox, 'place_changed', results[0]);
            }

      function touch_or_click_callback(e){
        var service = new google.maps.places.PlacesService(MapService.getGmap());
        var request = {
            location: MapService.getGmap().getCenter(), 
            query: e.currentTarget.children[1].innerText + ' ' + e.currentTarget.children[2].innerText,
            radius: 500,
          };

        function callback(results, status) {
          if (status == google.maps.places.PlacesServiceStatus.OK) {
            console.log('triggered');
            google.maps.event.trigger(searchbox, 'place_changed', results[0]);
          }

        }
        
        service.textSearch(request, callback);
      }
    }
  };
}
directives.directive('edlGoogleMap', edlGoogleMap);
