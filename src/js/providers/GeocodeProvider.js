providers.provider("Geocode", GeocodeProvider_);

function GeocodeProvider_ () {
  /* ================================

  ================================ */


  this.$get = [ "Clientstream", function googleAddressProvider (Client) {

    Client.listen('validate zip', function (zip){

    });

    var addy = {};
    var map = {};
    // 
    function parseAddy (addy) {
      console.log('brah!', addy);
    }

    function geocodeZip(zip) {
      // TODO: use streams for this later
      var center,
          obj;

      obj = { postalCode: zip };

      geocodeAddress(obj, function(response) {
        if (typeof response.lat !== "function") {
          return response;
        } else {
          center = {
            lat: response.lat(),
            lng: response.lng()
          };
          service.g.gmap.setCenter(center);
          getGmapMaxZoom(center, function(zoom) {
            service.g.gmap.setZoom(zoom);
            recenterMap(center);
            return true;
          });
        }
      })
    }

    function geocode_builder_brah () {
      return {
        map: map,
        addy: addy,
        parseAddy: parseAddy,
      };
    }

    // always save your firebase references when you create them
    return new geocode_builder_brah();
  } ];
}
