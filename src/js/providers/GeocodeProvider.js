providers.provider("Geocode", GeocodeProvider_);

function GeocodeProvider_ () {
  /* ================================

  ================================ */


  this.$get = [ "Clientstream", function googleAddressProvider (Client) {

    Client.listen('validate zip', function (zip){

    });

    var addy = {};

    function parseAddy (addy) {
      console.log('brah!', addy);
    }

    function geocode_builder_brah () {
      return {
        addy: addy,
        parseAddy: parseAddy,
      };
    }

    // always save your firebase references when you create them
    return new geocode_builder_brah();
  } ];
}
