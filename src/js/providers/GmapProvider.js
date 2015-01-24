/* =========================================================

  MapProvider

  provides a map

  emits results to the Clientstream
  to which map controllers listen

========================================================= */

providers.provider("Gmap", GmapFactory_);

function GmapFactory_ () {

  this.$get = ["Clientstream", "Configurator", function (Client, Configurator) {

    var DEFAULT,
        map,
        mapOpts;

    DEFAULT = {
      LAT: 30,
      LNG: -123,
    };

    mapOpts = {
      zoom: 4,
      minZoom: 4,
      center: new google.maps.LatLng(DEFAULT.LAT, DEFAULT.LNG),
      mapTypeId: google.maps.MapTypeId.HYBRID,
      disableDefaultUI: true,
      backgroundColor: "transparent",
      // draggable: false,
      // zoomable: false,
      // scrollwheel: false,
    }

    Client.listen('center changed', checkMaxZoom);

    function init (data) {
      map = new google.maps.Map(data, mapOpts);
      return map;
    }

    function checkMaxZoom(location) {
      var zoom,
          latLng,
          maxZoomService;

      zoom = map.getZoom();
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
          Client.emit('max zoom found', 17);
        } else {
          console.log("max zoom at location:", response.zoom);
          Client.emit('max zoom found', response.zoom);
        }
      });
    }

    // given a location on the map, make and drop a marker there
    function dropPin(location) {
      var marker;
      console.log("dropping new pin on:", location);

      marker = new google.maps.Marker({
        position: location,
        map: map,
        draggable: false,
        icon: 'img/burstpin.png'
      });
    }

    function gmap_assembly () {
      return {
        map: map,
        opts: mapOpts,
        init: init,
        // function: function,
      };
    }

    return new gmap_assembly();
  }];
}
