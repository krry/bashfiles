/* ==================================================
  FormCtrl
  the form controller
================================================== */

controllers.controller("FormCtrl", ["$scope", "Form", "Clientstream", "Geocoder", "UserService", "Session", "MapService", FormCtrl_]);

function FormCtrl_($scope, Form, Client, Geocoder, UserService, Session, MapService) {
  var vm = this;
  // var form_ref = Form.ref();

  vm.user = {};
  vm.checkZip = checkZip;
  vm.gmapShown = false;
  vm.valid = true;
  vm.invalidZip = true;
  vm.invalidTerritory = true;
  vm.validAddress = false;
  vm.territoryMsg = "";
  vm.prevStep = prev;
  vm.nextStep = next;

  // TODO: on change of the user model due to user changing the input values and angular syncing that with the data model, run it through validators, and then save it to firebase
  // vm.$watch('user', function(){})

  Client.listen('gmap shown', showGmap);
  Client.listen('outside US', validateZip);
  Client.listen('valid territory', validateTerritory);
  Client.listen('valid address', validateAddress);

  function checkZip (zip) {
    console.log('fart fart', zip);
    // accept zip from input
    if (typeof zip !== "undefined" && zip.length === 5) {
    // validate with GeocodeProvider
      Geocoder.sendGeocodeRequest(zip);
    // emit to 'valid zip' event
    }
  }

  function showGmap(data) {
    vm.gmapShown = data ? data : false;
    return vm.gmapShown;
  }

  function validateZip(data) {
    vm.invalidZip = !data;
    vm.valid = !vm.invalidZip && !vm.invalidTerritory;
    return vm.invalidZip;
  }

  function validateTerritory(data) {
    vm.invalidTerritory = !data;
    vm.valid = !vm.invalidZip && !vm.invalidTerritory;
    return vm.invalidTerritory;
  }

  function validateAddress(data) {
    console.log('validateAddress data is:', data);
    if (data) {
      vm.invalid = true;
      // vm.form_ref.update(data);
      $scope.$apply();
    }
  }

  function prev () {
    Session.prev();
  }

  function next () {
    // TODO: currently not checking if valid
    /* jshint -W030 */
    vm.valid && Session.next();
    /* jshint +W030 */
  }
}
