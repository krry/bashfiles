function FormCtrl_($scope, FormService) {
  var vm = this;

  $scope.user = FormService.userObj;

  vm.checkZip = function(){
    console.log("zipCheck called");
    // check to see if there are 5 digits
      // if not, show gentle validation
      // if so, check if valid US ZIP
        // if not, show error state and message
        // if so, pass to checkTerritory API
          // if not, show out of territory state
          // if so, advance to address step
            // return mapService.initNearMe()
  };

  vm.parseAddress = function(){
    console.log('parsing address');
    // package and send full address to Google Maps API for sanitation
    // populate sanitized address in the address fields
    // center map on latlng of address
    // check if street address present in sanitized address
      // if so, drop map marker on this location
  }
};

controllers.controller("FormCtrl", FormCtrl_);
