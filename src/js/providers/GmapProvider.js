/* =========================================================

  GmapFactory

  manufactures a gmap

  emits results to the Clientstream
  to which gmap controllers listen

========================================================= */

providers.provider("Gmap", [GmapFactory_]);

function GmapFactory_ () {

  this.$get = ["$q", "Clientstream", function ($q, Client) {

    var DEFAULT,
        map,
        map_opts,
        map_styles,
        pins,
        activePin,
        dfd,
        loaded;

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
    };

    pins = [];
    dfd = $q.defer();
    loaded = dfd.promise;

    Client.listen('Geocoder: valid warehouse', zoomToHood);
    Client.listen('Geocoder: valid house', checkMaxZoom);
    Client.listen('Gmap: drop pin', dropPin);
    Client.listen('Gmap: clear pins', clearPins);

    function init (data) {
      if (map !== undefined ) {
        map_opts.center = map.getCenter();
        map_opts.zoom = map.getZoom();
      }
      map = new google.maps.Map(data, map_opts);

      google.maps.event.addListener(map, 'idle', function() {
        dfd.resolve(map);
      });

      return map;
    }

    function zoomToHood (data) {
      var zip = data.zip;
      // console.log('zooming into neighborhood in zipcode', zip);
      Client.emit('Gmap: max zoom found', 16);
    }

    function checkMaxZoom(addy) {
      var zoom,
          latLng,
          maxZoomService,
          location;

      location = addy.location;

      // handle case where .lng & .lng() differ.
      if (typeof location.lng === "function") {
        latLng = new google.maps.LatLng(location.lat(), location.lng());
      } else {
        latLng = new google.maps.LatLng(location.lat, location.lng);
      }

      Client.emit('valid latlng', {
        lat: latLng.lat(),
        lng: latLng.lng()
      });

      maxZoomService = new google.maps.MaxZoomService();

      maxZoomService.getMaxZoomAtLatLng(latLng, function(response) {
        if (response.status !== google.maps.MaxZoomStatus.OK) {
          // console.log("max zoom failed:", response.status);
          // HACK: hardcode fallback when zoom ain't
          Client.emit('Gmap: max zoom found', 20);
        } else {
          // console.log("max zoom at location:", response.zoom);
          Client.emit('Gmap: max zoom found', response.zoom);
        }
      });
    }

    // given a location on the map, make and drop a marker there
    function dropPin(opts) {
      loaded.then(function() {
        var pin = {};
        var image = {
          url: 'img/map_solar_house_4.svg',
          scaledSize: new google.maps.Size(60, 30),
          origin: new google.maps.Point(0, 0),
          anchor: new google.maps.Point(30, 60)
        };
        var shape = {
          type: "poly",
          coords: [1, 1, 60, 1, 60, 60, 1, 60]
        }

        pin.marker = new google.maps.Marker({
          position: opts.location,
          map: map,
          draggable: false,
          icon: image
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
      });
    }

    function clearPins() {
      loaded.then(function() {
        activePin = null;

        angular.forEach(pins, function(pin) {
          pin.marker.setMap(null);
          pin.infowindow = null;
          google.maps.event.removeListener(pin.listener);
        });

        pins.length = 0;
      });
    }

    function gmap_assembly () {
      return {
        map: map,
        opts: map_opts,
        init: init,
        loaded: loaded
        // function: function,
      };
    }

    return new gmap_assembly();
  }];
}
