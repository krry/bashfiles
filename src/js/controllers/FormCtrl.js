/* ==================================================
  FormCtrl
  the form controller
================================================== */

controllers.controller("FormCtrl", ["$scope", "Form", "Clientstream", "Geocoder", "Prospect", "Session", FormCtrl_]);

function FormCtrl_($scope, Form, Client, Geocoder, Prospect, Session) {
  var vm = this;
  // var form_ref = Form.ref();

  vm.prospect = {};
  vm.checkZip = checkZip;
  vm.valid = false;  // use ng-valid from form
  vm.validZip = true;
  vm.validTerritory = true;
  vm.validAddress = false;
  vm.territoryMsg = "";
  vm.prevStep = prev;
  vm.nextStep = next;

  // TODO: on change of the user model due to user changing the input values and angular syncing that with the data model, run it through validators, and then save it to firebase
  // vm.$watch('user', function(){})

  Client.listen('outside US', acceptValidZip);
  // Client.listen('valid zip', acceptValidZip);
  Client.listen('valid territory', acceptValidTerritory);
  Client.listen('valid address', acceptValidAddress);
  Client.listen('email saved', acceptSavedEmail);
  Client.listen('birthdate saved', acceptSavedBirthdate);
  Client.listen('phone saved', acceptSavedPhone);
  Client.listen('fullname saved', acceptSavedFullname);

  function checkZip (zip) {
    if (typeof zip !== "undefined" && zip.length === 5) {
      Geocoder.sendGeocodeRequest(zip);
    }
    else { return false; }
  }

  function checkAddress (prospect) {
    var addy;
    if (prospect !== {}) {
      addy = {
        address: vm.prospect.address,
        city: vm.prospect.city,
        state: vm.prospect.state,
        zip: vm.prospect.zip,
      }
      Geocoder.sendGeocodeRequest(addy);
    }
  }

  function checkFullName () {}
  function checkEmail () {}
  function checkPhone () {}
  function checkBirthdate () {}

  function acceptValidZip(data) {
    if (data) {
      vm.validZip = true;
      vm.prospect.zip = data;
    } else vm.validZip = false;
    return vm.validZip;
  }

  function acceptValidTerritory(data) {
    vm.validTerritory = data;
    if (vm.validZip) vm.valid = data;
    return next();
  }

  function acceptValidAddress(data) {
    console.log('validateAddress data is:', data);
    if (data) {
      vm.valid = true;
      // vm.form_ref.update(data);
      $scope.$apply();
    }
  }

  function acceptSavedEmail (data) {
    vm.prospect.email = data ? data : "";
  }
  function acceptSavedBirthdate (data) {
    vm.prospect.birthdate = data ? data : "";
  }
  function acceptSavedPhone (data) {
    vm.prospect.phone = data ? data : "";
  }
  function acceptSavedFullname (data) {
    vm.prospect.fullname = data ? data : "";
  }

  function prev () {
    console.log('going to previous step');
    Session.prev();
  }

  function next () {
    console.log('going to next step');
    // TODO: currently not checking if valid
    /* jshint -W030 */
    vm.valid && Session.next();
    /* jshint +W030 */
  }
}
