/* ==================================================

  FormCtrl

  the form controller

================================================== */

controllers.controller("FormCtrl", ["$scope", "$element", "Clientstream", "Geocoder", "Form", "Credit", "Contact", "Utility", "Salesforce", "CREDIT_FAIL", FormCtrl_]);

function FormCtrl_($scope, $element, Client, Geocoder, Form, Credit, Contact, Utility, Salesforce, CREDIT_FAIL) {
  var vm = this;
  var form_stream;

  vm.prospect = Form.prospect;

  /* bootstrap the controller's model from the form provider, listen for changes */
  Client.listen('Form: Loaded', bootstrapForm);
  Client.listen('geocode results', badZip);

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
      setTimeout(function() {
        $scope.$apply(); // update the views
      }, 0);
    }
    /* jshint -W030 */
    // HACK: hardcode bill should be angular.constant
    !form_obj.bill && Client.emit('Form: valid data', {bill: 100});
    /* jshint +W030 */
  }

  /* end bootstrap */

  vm.gmapShown = false;
  vm.invalidZip = true;
  vm.invalidTerritory = true;
  vm.validAddress = false;
  vm.isSubmitting = false;

  vm.prevStep = prev;
  vm.nextStep = next;
  vm.checkZip = checkZip;
  vm.checkAddress = checkAddress;
  vm.checkCredit = checkCredit;
  vm.createContact = createContact;
  vm.skipConfigurator = skipConfigurator;

  // TODO: on change of the user model due to user changing the input values and angular syncing that with the data model, run it through validators, and then save it to firebase
  // vm.$watch('user', function(){})

  Client.listen('outside US', acceptValidZip);
  // Client.listen('valid zip', acceptValidZip);
  Client.listen('valid latlng', acceptValidLatLng);
  Client.listen('valid territory', acceptValidTerritory);
  Client.listen('valid address', acceptValidAddress);
  Client.listen('valid house', acceptValidHouse);
  Client.listen('valid state', acceptValidState);
  Client.listen('valid city', acceptValidCity);
  Client.listen('valid warehouse', acceptValidWarehouse);
  Client.listen('email saved', acceptSavedEmail);
  Client.listen('birthdate saved', acceptSavedBirthdate);
  Client.listen('phone saved', acceptSavedPhone);
  Client.listen('fullname saved', acceptSavedFullname);
  Client.listen('neighbor_count saved', acceptNeighborCount);

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
      if (addy.street) {
        Client.emit('spin it', true);
        Geocoder.sendGeocodeRequest(addy);
      }
    }
  }

  function checkFullName () {}
  function checkEmail () {}
  function checkPhone () {}
  function checkBirthdate () {}

  function badZip (data) {
    if (!data) {
      vm.invalid = true;
      vm.invalidZip = true;
      vm.invalidTerritory = false;
    }
  }

  function outOfTerritory (data) {
    if (!data) {
      vm.invalid = true;
      vm.invalidZip = false;
      vm.invalidTerritory = true;
    }
  }

  function checkCredit() {
    vm.isSubmitting = true;

    // TODO: remove this from production builds
    if (vm.prospect.email === CREDIT_FAIL.EMAIL) {
      vm.prospect.addressId = CREDIT_FAIL.ADDRESS_ID;
      vm.prospect.dob = new Date(CREDIT_FAIL.DOB);
    }

    checkAll({
      ContactId: vm.prospect.contactId,
      AddressId: vm.prospect.addressId,
      BirthDate: moment(vm.prospect.dob).format('MM/DD/YYYY')
    }).then(function(data) {
      var stage = data.CreditResultFound ? 'next' : 'back';
      Client.emit('Form: valid data', { qualified: data.qualified });
      vm.isSubmitting = false;
      vm.timedOut = false;
      
      // Only do this stage change if all three bureaus didn't qualify 
      if (!data.qualified) {
        Client.emit('stage', stage);
      }
    }, function(resp) {
      vm.isSubmitting = false;
      
      // Timed out
      if (resp.status === 0) {
        vm.timedOut = true;
      } else {
        Client.emit('jump to step', 'congrats');
      }
    });
  }

  function checkAll(data) {
    var result = {
      CreditResultFound: false,
      qualified: false
    };

    return checkBureau(data, result, Credit.bureaus.Experian)
      .then(checkBureau.bind(this, data, result, Credit.bureaus.Transunion))
      .then(checkBureau.bind(this, data, result, Credit.bureaus.Equifax));
  }

  function checkBureau(data, result, bureau) {
    data.Bureau = bureau;
    // Don't check again if already qualified and met min tranche
    if (result.qualified && result.MinTrancheMet) {
      return result;
    }

    return Credit.check(data).then(function(data) {
      if (data.CreditResultFound) {
        result.CreditResultFound = true;
      }

      // Set to qualified and advance the screen only on the first time of getting qualified
      if (data.qualified && !result.qualified) {
        result.qualified = true;
        vm.isSubmitting = false;
        vm.timedOut = false;

        if (vm.prospect.skipped && data.qualified) {
          Client.emit('jump to step', 'congrats');
        } else {
          Client.emit('stage', 'next');
        }
      }

      if (data.MinTrancheMet) {
        result.MinTrancheMet = data.MinTrancheMet;
      }

      return result;
    });
  }

  function createContact() {
    vm.isSubmitting = true;

    Contact.create({
      Email: vm.prospect.email,
      FirstName: vm.prospect.firstName,
      LastName: vm.prospect.lastName,
      PhoneNumber: vm.prospect.phone,
      Address: {
        AddressLine1: vm.prospect.home,
        AddressLine2: '',
        City: vm.prospect.city,
        State: vm.prospect.state,
        Zip: vm.prospect.zip,
        Country: 'US',
        Latitude: vm.prospect.lat,
        Longitude: vm.prospect.lng
      }
    }).then(function(data) {
      vm.prospect.contactId = data.ContactId;
      vm.prospect.addressId = data.AddressId;
      vm.isSubmitting = false;
      vm.timedOut = false;

      Client.emit('Form: valid data', {
        contactId: vm.prospect.contactId,
        addressId: vm.prospect.addressId,
        firstName: vm.prospect.firstName,
        lastName: vm.prospect.lastName,
        phone: vm.prospect.phone,
        email: vm.prospect.email
      });

      Client.emit('stage', 'next');
    }, function(resp) {
      vm.isSubmitting = false;

      if (resp.status === 0) {
        vm.timedOut = true;
      } else {
        Client.emit('jump to step', 'congrats');
      }
    })
  }

  //function to setup the lead object
  //will be used to create or update the lead
  //TODO get the oda from the session
  //TODO get the firebase sessionid
  function createLead(leadStatus, unqualifiedReason) {
    vm.isSubmitting = true;

    Salesforce.createLead({
      LeadId: vm.prospect.leadId,
      FirstName: vm.prospect.firstName,
      LastName: vm.prospect.lastName,
      Email: vm.prospect.email,
      Phone: vm.prospect.phone,
      Street: vm.prospect.home,
      City: vm.prospect.city,
      State: vm.prospect.state,
      PostalCode: vm.prospect.zip,
      //OwnerId: '005300000058ZEZAA2',//oda userId
      //ExternalId: 'externalidtest03-01'//firebasesessionID
    }).then(function(data) {
      vm.prospect.leadId = data.leadId;
      vm.isSubmitting = false;
      Client.emit('Form: valid data', {
        leadId: data.leadId
      });
    })
  }


  function skipConfigurator() {
    vm.prospect.skipped = true;
    // TODO: store this under the Session object in Firebase
    Client.emit('Form: valid data', { skipped: true });
    Client.emit('jump to stage', 'flannel.signup');
  }

  // TODO: figure out if the valid territory / valid zip dependency is appropriate for the prescribed UX
  function acceptValidTerritory(data) {
    // accepting valid territory
    // acceptValidZip(data);
    vm.invalidTerritory = !data;
    vm.invalid = vm.invalidZip && vm.invalidTerritory;
    if (vm.validZip) vm.valid = data;
    Client.emit('jump to step', 'address-roof');
  }

  function acceptValidZip(data) {
    // accepting valid zip
    if (data) {
      vm.invalidZip = !data;
      vm.invalid = vm.invalidZip && vm.invalidTerritory;
      vm.prospect.zip = data;
    } else vm.invalidZip = true;
    return !vm.invalidZip;
  }

  function acceptValidLatLng(data) {
    if (data) {
      vm.validLatLng = true;
      vm.prospect.lat = data.lat;
      vm.prospect.lng = data.lng;
      Client.emit('Form: valid data', data);
    } else vm.validLatLng = false;
    return vm.validLatLng;
  }

  function acceptValidState(data) {
    // accepting valid state
    if (data) {
      vm.validState = true;
      vm.prospect.state = data;
    } else vm.validState = false;
    return vm.validState;
  }

  function acceptValidCity(data) {
    // accepting valid city
    if (data) {
      vm.validCity = true;
      vm.prospect.city = data;
    } else vm.validCity = false;
    return vm.validCity;
  }

  function acceptValidWarehouse(data) {
    if (data) {
      vm.prospect.warehouseId = data;
      Client.emit('Form: valid data', { warehouseId: data });
    }
  }

  function acceptValidAddress(data) {
    // accepting valid address
    if (data) {
      vm.validAddress = true;
      vm.prospect.address = data;
    } else vm.validAddress = false;
    return vm.validAddress;
  }

  function acceptValidHouse(data) {
    // sync full address
    // accepting valid house
    if (data) {
      vm.invalid = false;
      vm.prospect.street = data.home;

      Client.emit('Form: valid house', data);
      Client.emit('jump to step', 'monthly-bill');

      saveUtility();
    }
  }

  function saveUtility() {
    if (Utility.isSubmitting) {
      return; 
    }

    Utility.isSubmitting = true;
    Utility.search({
      city: vm.prospect.city,
      zip: vm.prospect.zip
    }).then(function(data) {
      return Utility.get({ utilityid: data[0].UtilityId });
    }).then(function(data) {
      vm.prospect.utilityId = data.UtilityID;
      Client.emit('Form: valid data', { utilityId: vm.prospect.utilityId });
      Utility.isSubmitting = false;
    });
  }

  function acceptNeighborCount(data) {
    vm.prospect.neighbor_count = data ? data : "";
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
