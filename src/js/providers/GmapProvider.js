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
        mapOpts;

    DEFAULT = {
      LAT: 30,
      LNG: -123,
    };

    mapOpts = {
      zoom: 4,
      minZoom: 4,
      center: new google.maps.LatLng(DEFAULT.LAT, DEFAULT.LNG),
      mapTypeId: google.maps.MapTypeId.TERRAIN,
      disableDefaultUI: true,
      backgroundColor: "transparent",
      // draggable: false,
      // zoomable: false,
      // scrollwheel: false,
    }

    Client.listen('valid territory', zoomToHood);
    Client.listen('valid house', checkMaxZoom);
    Client.listen('drop pin', dropPin);

    function init (data) {
      map = new google.maps.Map(data, mapOpts);
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
      var marker;
      console.log("dropping new pin on:", location);

      marker = new google.maps.Marker({
        position: location,
        map: map,
        draggable: false,
        //icon: 'img/burstpin.png'
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
