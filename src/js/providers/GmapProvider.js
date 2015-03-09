/* =========================================================

  GmapProvider

  provides a gmap

  emits results to the Clientstream
  to which gmap controllers listen

========================================================= */

providers.provider("Gmap", GmapFactory_);

function GmapFactory_ () {

  this.$get = ["Clientstream", function (Client) {

    var DEFAULT,
        map,
        map_opts,
        map_styles,
        pins;

    DEFAULT = {
      LAT: 30,
      LNG: -123,
    };

    map_styles = [
      {
        "featureType": "road.highway",
        "elementType": "geometry.stroke",
        "stylers": [
          { "color": "#9F9E9E" }
        ]
      },{
        "featureType": "road.highway",
        "elementType": "geometry.fill",
        "stylers": [
          { "color": "#9F9E9E" }
        ]
      },{
        "featureType": "road.arterial",
        "elementType": "geometry.stroke",
        "stylers": [
          { "color": "#9F9E9E" }
        ]
      },{
        "featureType": "road.local",
        "elementType": "geometry.stroke",
        "stylers": [
          { "color": "#9F9E9E" }
        ]
      },{
        "featureType": "road.local",
        "elementType": "geometry.fill",
        "stylers": [
          { "color": "#9f9e9e" }
        ]
      },{
        "featureType": "road.arterial",
        "elementType": "geometry.stroke",
        "stylers": [
          { "color": "#9F9E9E" }
        ]
      },{
        "featureType": "road.arterial",
        "elementType": "geometry.fill",
        "stylers": [
          { "color": "#9f9e9e" }
        ]
      },{
        "featureType": "water",
        "elementType": "geometry.fill",
        "stylers": [
          { "color": "#444444" }
        ]
      },{
        "featureType": "landscape.natural.terrain",
        "elementType": "geometry.fill",
        "stylers": [
          { "color": "#CECAC8" }
        ]
      },{
        "featureType": "poi.park",
        "elementType": "geometry.fill",
        "stylers": [
          { "color": "#CECAC8" }
        ]
      },{
        "featureType": "poi",
        "stylers": [
          { "visibility": "off" }
        ]
      },{
        "featureType": "transit.line",
        "stylers": [
          { "color": "#9f9e9e" }
        ]
      },{
        "featureType": "transit.station",
        "stylers": [
          { "visibility": "off" }
        ]
      },{
        "featureType": "road.local",
        "elementType": "labels.text.stroke",
        "stylers": [
          { "color": "#E9E5DC" }
        ]
      },{
        "featureType": "road.arterial",
        "elementType": "labels.text.stroke",
        "stylers": [
          { "color": "#E9E5DC" }
        ]
      },{
        "featureType": "road.local",
        "elementType": "labels.text.fill",
        "stylers": [
          { "color": "#777777" }
        ]
      },{
        "featureType": "road.arterial",
        "elementType": "labels.text.fill",
        "stylers": [
          { "color": "#666666" }
        ]
      },{
        "featureType": "road.highway",
        "elementType": "labels.text.fill",
        "stylers": [
          { "color": "#666666" }
        ]
      },{
        "featureType": "road.highway",
        "elementType": "labels.text.stroke",
        "stylers": [
          { "color": "#E9E5DC" }
        ]
      },{
        "featureType": "road.highway",
        "elementType": "labels.icon",
        "stylers": [
          { "visibility": "off" }
        ]
      },{
        "featureType": "landscape.natural",
        "elementType": "geometry.fill",
        "stylers": [
          { "color": "#D9D5CC" }
        ]
      },{
        "featureType": "water",
        "elementType": "labels.text",
        "stylers": [
          { "visibility": "off" }
        ]
      },{
        "featureType": "landscape.natural",
        "elementType": "labels.icon",
        "stylers": [
          { "visibility": "off" }
        ]
      },{
        "featureType": "road",
        "elementType": "labels.icon",
        "stylers": [
          { "visibility": "off" }
        ]
      }
    ];

    map_opts = {
      zoom: 4,
      minZoom: 4,
      center: new google.maps.LatLng(DEFAULT.LAT, DEFAULT.LNG),
      mapTypeId: google.maps.MapTypeId.TERRAIN,
      disableDefaultUI: true,
      backgroundColor: "transparent",
      draggable: false,
      zoomable: false,
      styles: map_styles,
      // scrollwheel: false,
    }

    pins = [];

    Client.listen('valid territory', zoomToHood);
    Client.listen('valid house', checkMaxZoom);
    Client.listen('drop pin', dropPin);
    Client.listen('clear pins', clearPins);

    function init (data) {
      map = new google.maps.Map(data, map_opts);
      return map;
    }

    function zoomToHood (zip) {
      console.log('zooming into neighborhood in zipcode', zip);
      Client.emit('max zoom found', 16);
      Client.emit('get nearme data', true);
    }

    function checkMaxZoom(addy) {
      var zoom,
          latLng,
          maxZoomService,
          location;

      location = addy.location;

      // zoom = map.getZoom();
      // console.log('old zoom level:', zoom);

      // handle case where .lng & .lng() differ.
      if (typeof location.lng === "function") {
        latLng = new google.maps.LatLng(location.lat(), location.lng());
      } else {
        latLng = new google.maps.LatLng(location.lat, location.lng);
      }
      console.log('latlng', latLng);

      Client.emit('valid latlng', {
        lat: latLng.lat(),
        lng: latLng.lng()
      });

      maxZoomService = new google.maps.MaxZoomService();

      maxZoomService.getMaxZoomAtLatLng(latLng, function(response) {
        if (response.status !== google.maps.MaxZoomStatus.OK) {
          console.log("max zoom failed:", response.status);
          // HACK: hardcode fallback when zoom ain't
          Client.emit('max zoom found', 17);
        } else {
          console.log("max zoom at location:", response.zoom);
          Client.emit('max zoom found', response.zoom);
        }
      });
    }

    // given a location on the map, make and drop a marker there
    function dropPin(location) {
      var pin;

      pin = new google.maps.Marker({
        position: location,
        map: map,
        draggable: false,
        icon: 'img/map_pin_1.svg'
      });

      pins.push(pin);
    }

    function clearPins() {
      angular.forEach(pins, function(pin) {
        pin.setMap(null);
      });

      pins.length = 0;
    }

    function gmap_assembly () {
      return {
        map: map,
        opts: map_opts,
        init: init,
        // function: function,
      };
    }

    return new gmap_assembly();
  }];
}
