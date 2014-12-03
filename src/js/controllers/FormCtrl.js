/* ==================================================
  FormCtrl
  the form controller
================================================== */

controllers.controller("FormCtrl", ["$scope", "UserService", "StageService", "MapService", FormCtrl_]);

function FormCtrl_($scope, UserService, StageService, MapService) {
  var vm = this;

  vm.user = UserService.user;

  vm.checkZip = checkZip;
  vm.parseAddress = parseAddress;

  vm.gmapShown = getGmapShown;
  vm.toggleGmapShown = toggleGmapShown;
  vm.setGmapShown = setGmapShown;

  function getGmapShown(){
    return MapService.getGmapShown();
  }

  function toggleGmapShown(){
    MapService.setGmapShown(!vm.gmapShown);
  }

  function setGmapShown(value){
    MapService.setGmapShown(value);
  }

  function checkZip (zip) {
    console.log("checking ZIP");
    if (typeof(zip) !== "undefined") {
      console.log(zip);
      setGmapShown(true);
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

  function parseAddress () {
    console.log('parsing address');
    // package and send full address to Google Maps API for sanitation
    // populate sanitized address in the address fields
    // center map on latlng of address
    // check if street address present in sanitized address
      // if so, drop map marker on this location
  }
}
