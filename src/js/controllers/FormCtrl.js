/* ==================================================
  FormCtrl
  the form controller
================================================== */

controllers.controller("FormCtrl", ["$scope", "UserService", "StageService", FormCtrl_]);

function FormCtrl_($scope, UserService, StageService, $firebase, SyncService, firebaseRef, design_ref) {
  var vm = this;
  vm.user = {
    zip: "",
    state: "",
    city: "",
    street: "",
    design_id: "",
    name: {
      first_name: "",
      last_name: ""
    },
    is_homeowner: null, // boolean
    phone: "",
    email: "",
    dob: {
      month: "",
      day: "",
      year: ""
    },
  }
  vm.checkZip = checkZip;
  vm.parseAddress = parseAddress;

  function checkZip (zip) {
    console.log("checking ZIP");
    console.log(zip);
    // check to see if there are 5 digits
    // debugger;
      // if not, show gentle validation
      // if so, check if valid US ZIP
        // if not, show error state and message
        // if so, pass to checkTerritory API
          // if not, show out of territory state
          // if so, advance to address step
            // return mapService.initNearMe()
  };

  function parseAddress () {
    console.log('parsing address');
    // package and send full address to Google Maps API for sanitation
    // populate sanitized address in the address fields
    // center map on latlng of address
    // check if street address present in sanitized address
      // if so, drop map marker on this location
  };
};
