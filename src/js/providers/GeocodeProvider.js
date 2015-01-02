providers.provider("Geocode", GeocodeProvider_);

function GeocodeProvider_ () {
  /* ================================

  ================================ */


  this.$get = [ "Clientstream", function googleAddressProvider(Client) {

    Client.listen('validate zip', function(zip){

    })

    function geocode_builder_brah() {
      return {
        butts:   function() { return "butts"},
      };
    }

    // always save your firebase references when you create them
    return new geocode_builder_brah();
  } ];
}
