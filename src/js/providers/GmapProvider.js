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
        pins,
        activePin;

    DEFAULT = {
      LAT: 30,
      LNG: -123,
    };

    map_styles = [
      {
        "featureType": "poi",
        "stylers": [
          { "visibility": "off" }
        ]
      },{
        "featureType": "water",
        "stylers": [
          { "color": "#444444" }
        ]
      },{
        "featureType": "transit.station",
        "elementType": "labels.icon",
        "stylers": [
          { "visibility": "off" }
        ]
      },{
        "featureType": "transit.line",
        "stylers": [
          { "visibility": "off" }
        ]
      },{
        "featureType": "road",
        "elementType": "labels.icon",
        "stylers": [
          { "visibility": "off" }
        ]
      },{
        "featureType": "water",
        "elementType": "labels",
        "stylers": [
          { "visibility": "off" }
        ]
      },{
        "featureType": "administrative.locality",
        "elementType": "labels",
        "stylers": [
          { "visibility": "off" }
        ]
      },{
        "featureType": "administrative.neighborhood",
        "elementType": "labels"  }
    ];

    map_opts = {
      zoom: 4,
      minZoom: 4,
      center: new google.maps.LatLng(DEFAULT.LAT, DEFAULT.LNG),
      mapTypeId: google.maps.MapTypeId.TERRAIN,
      disableDefaultUI: true,
      backgroundColor: "transparent",
      draggable: false,
      zoomable: true,
      styles: map_styles,
      // scrollwheel: false,
    }

    Client.listen('Geocoder: valid warehouse', zoomToHood);
    Client.listen('Geocoder: valid house', checkMaxZoom);
    Client.listen('Gmap: drop pin', dropPin);

    pins = [];

    Client.listen('clear pins', clearPins);

    function init (data) {
      map = new google.maps.Map(data, map_opts);
      return map;
    }

    function zoomToHood (data) {
      var zip = data.zip;
      console.log('zooming into neighborhood in zipcode', zip);
      Client.emit('Gmap: max zoom found', 16);
      Client.emit('Gmap: get nearme data', true);
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
          Client.emit('Gmap: max zoom found', 17);
        } else {
          console.log("max zoom at location:", response.zoom);
          Client.emit('Gmap: max zoom found', response.zoom);
        }
      });
    }

    // given a location on the map, make and drop a marker there
    function dropPin(opts) {
      var pin = {};

      pin.marker = new google.maps.Marker({
        position: opts.location,
        map: map,
        draggable: false,
        icon: 'img/map_pin_1.svg'
      });

      pin.infowindow = new google.maps.InfoWindow({
        content: opts.content,
        anchorPoint: new google.maps.Point(0, 0)
      });

      pin.listener = google.maps.event.addListener(pin.marker, 'click', function() {
        if (activePin) {
          activePin.infowindow.close();
        }

        pin.infowindow.open(map, pin.marker);
        activePin = pin;
      });

      pins.push(pin);
    }

    function clearPins() {
      activePin = null;

      angular.forEach(pins, function(pin) {
        pin.marker.setMap(null);
        pin.infowindow = null;
        google.maps.event.removeListener(pin.listener);
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
