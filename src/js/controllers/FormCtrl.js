/* ==================================================
  FormCtrl
  the form controller
================================================== */

controllers.controller("FormCtrl", ["$scope", "Form", "Clientstream", "Geocoder", "UserService", "Session", "MapService", FormCtrl_]);

function FormCtrl_($scope, Form, Client, Geocoder, UserService, Session, MapService) {
  var vm = this;

  vm.home = UserService.getHome();
  vm.prospect = UserService.getProspect();
  vm.checkZip = checkZip;
  vm.gmapShown = false;
  vm.valid = false; // use ng-valid from form
  vm.validZip = true;
  vm.validTerritory = true;
  vm.validAddress = false;
  vm.territoryMsg = "";
  vm.prevStep = prev;
  vm.nextStep = next;
  vm.form_ref = Form.ref();

  Client.listen('gmap shown', showGmap);
  Client.listen('outside US', validateZip);
  Client.listen('valid territory', validateTerritory);
  Client.listen('valid address', validateAddress);

  function checkZip (zip) {
    var zip;
    Client.emit('zip updated', zip);
    if (vm.form_ref.child('zip')) {
      zip = vm.form_ref.child('zip');
      console.log('zip field contains:', zip);
      Geocoder.geocode(zip, MapService.updateMap);
    }
  }

  function showGmap(data) {
    vm.gmapShown = data;
  }

  function validateZip(data) {
    vm.validZip = data;
  }

  function validateTerritory(data) {
    vm.validTerritory = data.is;
    vm.territoryMsg = data.msg;
  }

  function validateAddress(data) {
    console.log('validateAddress data is:', data);
    if (data) {
      vm.valid = true;
      vm.form_ref.update(data);
      $scope.$apply();
    }
  }

  function prev () {
    Session.prev();
  }

  function next () { // TODO: currently not checking if valid
    /* jshint -W030 */
    vm.valid && Session.next();
    /* jshint +W030 */
  }

}
