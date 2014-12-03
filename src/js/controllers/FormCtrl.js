/* ==================================================
  FormCtrl
  the form controller
================================================== */

controllers.controller("FormCtrl", ["$scope", "UserService", "StageService", "MapService", FormCtrl_]);

function FormCtrl_($scope, UserService, StageService, MapService) {
  var vm = this;

  vm.user = UserService.user;

  vm.checkZip = checkZip;
  vm.populateAddress = populateAddress;

  vm.gmapShown = MapService.getGmapShown;

  function checkZip (zip) {
    console.log("checking ZIP");
    if (typeof(zip) !== "undefined") {
      console.log(zip);
      MapService.setGmapShown(true);
      MapService.updateGmap({"postalCode": zip});
      // MapService.setGmap(MapService.g.gmap, MapService.g.mapOptions);
    }

    // check to see if there are 5 digits
    // debugger;
      // if not, show gentle validation
      // if so, check if valid US ZIP
        // if not, show error state and message
        // if so, pass to checkTerritory API
          // if not, show out of territory state
          // if so, advance to address step
            // return mapService.initNearMe()
  }

  function populateAddress () {
    console.log('parsing address');
    // TODO: use zip code to fill in city and state
    // package and send full address to Google Maps API for sanitation
    // populate sanitized address in the address fields
    // center map on latlng of address
    // check if street address present in sanitized address
      // if so, drop map marker on this location
  }
}
