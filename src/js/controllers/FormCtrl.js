/* ==================================================

  FormCtrl

  the form controller

================================================== */

controllers.controller("FormCtrl", ["$scope", "$location", "$element", "Clientstream", "Session", "Geocoder", "Form", "Credit", "Contact", "Utility", "Rates", "Salesforce", "CREDIT_FAIL", "URL_ROOT", "defaultValues", FormCtrl_]);

function FormCtrl_($scope, $location, $element, Client, Session, Geocoder, Form, Credit, Contact, Utility, Rates, Salesforce, CREDIT_FAIL, URL_ROOT, defaultValues) {

  var vm = this;
  var form_stream;

  vm.prospect = Form.prospect;

  /* bootstrap the controller's model from the form provider, listen for changes */
  Client.listen('Form: Loaded', bootstrapForm);
  Client.listen('geocode results', badZip);
  Client.listen('Stages: restart session', resetForm);

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
    // HACK: hardcode bill should be angular.constant
    !form_obj.bill && Client.emit('Form: valid data', {});
  }

  /* end bootstrap */

  vm.gmapShown = false;
  vm.invalidZip = false;
  vm.invalidTerritory = false;
  vm.validAddress = false;
  vm.isSubmitting = false;

  vm.prevStep = prev;
  vm.nextStep = next;
  vm.checkZip = checkZip;
  vm.saveBill = saveBill;
  vm.checkAddress = checkAddress;
  vm.checkCredit = checkCredit;
  vm.createContact = createContact;
  vm.skipConfigurator = skipConfigurator;

  Client.listen('zip rejected', rejectZip);
  Client.listen('check zip', checkZip);
  Client.listen('valid latlng', acceptValidLatLng);
  Client.listen('Geocoder: valid warehouse', acceptValidWarehouse);
  Client.listen('Geocoder: valid house', acceptValidHouse);
  Client.listen('Geocoder: invalid territory', outOfTerritory);
  Client.listen('email saved', acceptSavedEmail);
  Client.listen('birthdate saved', acceptSavedBirthdate);
  Client.listen('phone saved', acceptSavedPhone);
  Client.listen('fullname saved', acceptSavedFullname);
  Client.listen('neighbor_count saved', acceptNeighborCount);
  Client.listen('Modal: email submitted', acceptEmailFromShare);
  Client.listen('Form: save lead', createLead);
  Client.listen('create hotload link', createHotloadLink);
  Client.listen('Form: final near me data', setFinalNearMeData);

  function checkZip (zip) {
    console.log('********* checkin dat zip', zip, 'boss *********')
    /* jshint eqnull:true */
    if (zip != null && zip.length === 5) {
      // Only invalidate the street if the zip has changed - this allows the back button to function correctly
      if (zip !== vm.prospect.zip) {
        vm.prospect.street = null;
        Client.emit('Form: valid data', {street: null});
      }

      Client.emit('Spinner: spin it', true);
      Geocoder.sendGeocodeRequest(zip);
    }
    else { return false; }
  }

  function checkAddress (street) {
    // TODO: ensure that form is pulling latest prospect from Firebase
    var addy;

    setTimeout(function() {
      $scope.$apply();
    }, 0);

    if (street) {
      addy = {
        street: street,
        city: vm.prospect.city,
        state: vm.prospect.state,
        zip: vm.prospect.zip,
      };

      Client.emit('Spinner: spin it', true);
      Geocoder.sendGeocodeRequest(addy);
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
    if (data) {
      vm.invalid = true;
      vm.invalidZip = false;
      vm.invalidTerritory = true;
      vm.prospect.invalidTerritory = true;
      Client.emit('Form: valid data', { invalidTerritory: true });
    }
  }

  function resetForm() {
    var obj = {};
    for (var prop in vm.prospect) {
      if (vm.prospect.hasOwnProperty(prop)) {
        vm.prospect[prop] = null;
        obj[prop] = null;
      }
    }
  }

  function checkCredit() {
    vm.isSubmitting = true;

    saveDob();

    checkAll({
      ContactId: vm.prospect.contactId,
      AddressId: vm.prospect.addressId,
      BirthDate: vm.prospect.dob
    }).then(function(data) {
      var stage = data.CreditResultFound ? 'next' : 'back';
      vm.prospect.qualified = data.qualified;
      Client.emit('Form: valid data', { qualified: data.qualified });
      vm.isSubmitting = false;
      vm.timedOut = false;

      // Only do this stage change if all three bureaus didn't qualify
      if (!data.qualified) {
        createLead(Salesforce.statuses.failCredit);
        Client.emit('Stages: stage', stage);
      }
    }, function(resp) {
      createLead(Salesforce.statuses.noCreditResult);
      vm.isSubmitting = false;

      // Timed out
      if (resp.status === 0) {
        vm.timedOut = true;
      } else {
        Client.emit('Stages: jump to step', 'congrats');
      }
    });
  }

  function saveDob() {
    vm.prospect.dob =[
      vm.prospect.month,
      vm.prospect.day,
      vm.prospect.year
    ].join('/');

    // TODO: remove this from production builds
    if (vm.prospect.email === CREDIT_FAIL.EMAIL) {
      vm.prospect.addressId = CREDIT_FAIL.ADDRESS_ID;
      vm.prospect.dob = CREDIT_FAIL.DOB;
    }

    vm.prospect.dob = moment(new Date(vm.prospect.dob)).format('MM/DD/YYYY');
    Client.emit('Form: valid data', {
      month: vm.prospect.month,
      day: vm.prospect.day,
      year: vm.prospect.year,
      dob: vm.prospect.dob
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
        vm.prospect.qualified = data.qualified;
        Client.emit('Form: valid data', { qualified: data.qualified });
        createLead(Salesforce.statuses.passCredit);
        result.qualified = true;
        vm.isSubmitting = false;
        vm.timedOut = false;

        if (vm.prospect.skipped && data.qualified) {
          Client.emit('Stages: jump to step', 'congrats');
        } else {
          Client.emit('Stages: stage', 'next');
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

    Client.emit('Form: valid data', {
      firstName: vm.prospect.firstName,
      lastName: vm.prospect.lastName,
      phone: vm.prospect.phone,
      email: vm.prospect.email
    });

    createLead(Salesforce.statuses.contact);

    Contact.create({
      Email: vm.prospect.email,
      FirstName: vm.prospect.firstName,
      LastName: vm.prospect.lastName,
      PhoneNumber: vm.prospect.phone,
      Address: {
        AddressLine1: vm.prospect.street,
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

      Client.emit('Stages: jump to step', 'credit-check');
    }, function(resp) {
      vm.isSubmitting = false;

      if (resp.status === 0) {
        vm.timedOut = true;
      } else {
        Client.emit('Stages: jump to step', 'congrats');
      }
    })
  }

  function createLead(leadStatus, unqualifiedReason) {
    createHotloadLink();
    // TODO: handle duplicate error and bubble up feedback to user
    return Salesforce.createLead({
      // LeadSource: 'Online',
      // LastName: 'flannelflywheel',
      // Company: 'flannelflywheel',
      LeadId: vm.prospect.leadId,
      FirstName: vm.prospect.firstName,
      LastName: vm.prospect.lastName || 'flannelflywheel',
      Email: vm.prospect.email,
      Phone: vm.prospect.phone,
      Street: vm.prospect.street,
      City: vm.prospect.city,
      State: vm.prospect.state,
      PostalCode: vm.prospect.zip,
      LeadStatus: leadStatus,
      UnqualifiedReason: unqualifiedReason,
      OdaHotloadLink: vm.prospect.odaHotloadLink,
      Skipped: vm.prospect.skipped,
      Share_Proposal_Link__c: vm.prospect.share_link,
      // OwnerId: '005300000058ZEZAA2',//oda userId
      ExternalId: Session.id()
    }).then(function(data) {
      if (data.id) {
        vm.prospect.leadId = data.id;

        Client.emit('Form: valid data', { leadId: vm.prospect.leadId });
      }
    });
  }

  function createHotloadLink() {
    vm.prospect.odaHotloadLink = [
      $location.protocol(),
      '://',
      URL_ROOT,
      '/#/oda/',
      Session.id()
    ].join('');
  }

  function skipConfigurator() {
    vm.prospect.skipped = true;
    Client.emit('Form: valid data', { skipped: true });
    Client.emit('Stages: jump to stage', 'flannel.signup');
  }

  function rejectZip(data) {
    vm.invalidZip = data;
    vm.invalid = vm.invalidZip;
    Client.emit('Spinner: spin it', false);
    return vm.invalidZip;
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

  function acceptValidWarehouse(data) {
    if (data) {
      vm.invalidTerritory = !data;
      vm.invalidZip = !data;

      Client.emit('Stages: jump to step', 'address-roof');
      vm.prospect.warehouseId = data.warehouseId;
      Client.emit('Form: valid data', {
        zip: data.zip,
        warehouseId: data.warehouseId
      });
    }
  }

  function acceptValidHouse(data) {
    // sync full address
    // accepting valid house
    if (data && !vm.validAddress) {
      vm.invalid = false;
      vm.validAddress = true;
      vm.prospect.street = data.street;
      vm.prospect.zip = data.zip;
      vm.prospect.state = data.state;
      vm.prospect.city = data.city;
      Client.emit('Form: valid data', data);
      Client.emit('Stages: jump to step', 'monthly-bill');
      console.log('valid house accepted', data);
      getUtilities();
    }
  }

  function getUtilities() {
    if (Utility.isSubmitting) {
      return;
    }

    Utility.isSubmitting = true;

    return Utility.get({
      city: vm.prospect.city,
      zip: vm.prospect.zip
    }).then(getUtilityRates).then(saveUtility);
  }

  function saveUtility (data) {
    console.log(data);
    vm.prospect.utilityId = data;
    Client.emit('Form: valid data', {utilityId: data});
  }

  function getUtilityRates (data) {
    var utilityId = data[0].UtilityId;
    Rates.get({ utilityid: utilityId }).then(saveRates);
    return utilityId;
  }

  function saveRates (data) {
    var rates;

    // data from Rates API:
    // CashAvailable: true
    // FinancingKwhPrice: 0.15
    // LeaseAvailable: true
    // MedianUtilityPrice: 0.2233
    // MyPowerAvailable: true
    // PPAAvailable: true
    // UtilityAverageSystemEfficiency: 1468
    // UtilityID: 3

    vm.prospect.utilityRate = data.MedianUtilityPrice;
    vm.prospect.sctyRate = data.FinancingKwhPrice;
    vm.prospect.averageYield = data.UtilityAverageSystemEfficiency;

    rates = {
      utilityRate: vm.prospect.utilityRate,
      sctyRate: vm.prospect.sctyRate,
      averageYield: vm.prospect.averageYield,
    };

    Client.emit('Form: valid data', rates);
  }

  function saveBill (data) {
    console.log("bill", data);
    Client.emit('Form: valid data', { bill: data });
  }

  function acceptNeighborCount (data) {
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

  function acceptEmailFromShare(data) {
    vm.prospect.email = data;
    createLead(Salesforce.statuses.savedProposal);
  }

  function setFinalNearMeData(data) {
    vm.finalNearMeData = data;
  }

  function prev () {
    Client.emit('Stages: stage', "back");
  }

  function next () {
    // TODO: currently not checking if valid
    Client.emit('Stages: stage', "next");
  }
}
