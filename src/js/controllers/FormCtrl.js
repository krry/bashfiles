/* ==================================================

  FormCtrl

  the form controller

================================================== */

controllers.controller("FormCtrl", ["$scope", "$element", "Clientstream", "Geocoder", "Form", FormCtrl_]);

function FormCtrl_($scope, $element, Client, Geocoder, Form) {
  var vm = this;
  var form_stream;

  vm.prospect = Form.prospect;

  /* bootstrap the controller's model from the form provider, listen for changes */
  Client.listen('Form: Loaded', bootstrapForm);

  function bootstrapForm (form_obj) {
    // subscribe to the stream
    form_stream = Form.form_stream()
    // .distinctUntilChanged()
    .select(function(x) { return x.exportVal();})
    .subscribe(streamSubscription)
    // let session provider know you're subscribed, so it can make the
    Client.emit('Form: subscribed to form_stream', form_obj);
  }

  function streamSubscription (form_obj) {
    var key, keys, val;
    if (form_obj === null) return; // will be null if no data on firebase
    keys = Object.keys(form_obj);  // HACK: this may fail in different js interpretters... #readabookbrah
    if (!angular.equals(form_obj, vm.prospect)) { // firebase different from local
      for (var i = 0; i < keys.length; i++) {
        key = keys[i];
        val = form_obj[key];
        vm.prospect[key] = val;
      }
      $scope.$apply(); // update the views
    }
    !form_obj.bill && Client.emit('Form: update value', {bill: 100}); // HACK: hardcode bill should be angular.constant
  }

  /* end bootstrap */

  vm.gmapShown = false;
  vm.invalidZip = true;
  vm.invalidTerritory = true;
  vm.validAddress = false;

  vm.prevStep = prev;
  vm.nextStep = next;
  vm.checkZip = checkZip;
  vm.checkAddress = checkAddress;

  // TODO: on change of the user model due to user changing the input values and angular syncing that with the data model, run it through validators, and then save it to firebase
  // vm.$watch('user', function(){})

  Client.listen('outside US', acceptValidZip);
  // Client.listen('valid zip', acceptValidZip);
  Client.listen('valid territory', acceptValidTerritory);
  Client.listen('valid address', acceptValidAddress);
  Client.listen('valid house', acceptValidHouse);
  Client.listen('valid state', acceptValidState);
  Client.listen('valid city', acceptValidCity);
  Client.listen('email saved', acceptSavedEmail);
  Client.listen('birthdate saved', acceptSavedBirthdate);
  Client.listen('phone saved', acceptSavedPhone);
  Client.listen('fullname saved', acceptSavedFullname);

  function checkZip (zip) {
    console.log('************ checkin dat zip', zip, 'boss *********')
    if (typeof zip !== "undefined" && zip.length === 5) {
      Client.emit('spin it', true);
      Geocoder.sendGeocodeRequest(zip);
    }
    else { return false; }
  }

  function checkAddress (prospect) {
    console.log('checking address for', prospect);
    var addy;
    if (prospect !== {}) {
      addy = {
        street: vm.prospect.street,
        city: vm.prospect.city,
        state: vm.prospect.state,
        zip: vm.prospect.zip,
      }
      Client.emit('spin it', true);
      Geocoder.sendGeocodeRequest(addy);
    }
  }

  function checkFullName () {}
  function checkEmail () {}
  function checkPhone () {}
  function checkBirthdate () {}

  // TODO: figure out if the valid territory / valid zip dependency is appropriate for the prescribed UX
  function acceptValidTerritory(data) {
    console.log('accepting valid territory', data);
    // acceptValidZip(data);
    vm.invalidTerritory = !data;
    vm.invalid = vm.invalidZip && vm.invalidTerritory;
    if (vm.validZip) vm.valid = data;
    Client.emit('jump to step', 'address-roof');
  }

  function acceptValidZip(data) {
    console.log('accepting valid zip', data);
    if (data) {
      vm.invalidZip = !data;
      vm.invalid = vm.invalidZip && vm.invalidTerritory;
      vm.prospect.zip = data;
    } else vm.invalidZip = true;
    return !vm.invalidZip;
  }

  function acceptValidState(data) {
    console.log('accepting valid state', data);
    if (data) {
      vm.validState = true;
      vm.prospect.state = data;
    } else vm.validState = false;
    return vm.validState;
  }

  function acceptValidCity(data) {
    console.log('accepting valid city', data);
    if (data) {
      vm.validCity = true;
      vm.prospect.city = data;
    } else vm.validCity = false;
    return vm.validCity;
  }

  function acceptValidAddress(data) {
    console.log('accepting valid address', data);
    if (data) {
      vm.validAddress = true;
      vm.prospect.address = data;
    } else vm.validAddress = false;
    return vm.validAddress;
  }

  function acceptValidHouse(data) {
    // sync full address
    console.log('accepting valid house:', data.home);
    if (data) {
      vm.invalid = false;
      vm.prospect.street = data.home;
      Client.emit('jump to step', 'monthly-bill');
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
    Client.emit('stage', "back");
  }

  function next () {
    // TODO: currently not checking if valid
    /* jshint -W030 */
    Client.emit('stage', "next");
    /* jshint +W030 */
  }
}
