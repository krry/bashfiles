/* ==================================================

  FormCtrl

  the form controller

================================================== */

controllers.controller("FormCtrl", ["$scope", "$location", "$element", "Clientstream", "Session", "User", "Geocoder", "Form", "Credit", "Contact", "Utility", "Rates", "Salesforce", "CREDIT_FAIL", "URL_ROOT", "defaultValues", FormCtrl_]);

function FormCtrl_($scope, $location, $element, Client, Session, User, Geocoder, Form, Credit, Contact, Utility, Rates, Salesforce, CREDIT_FAIL, URL_ROOT, defaultValues) {

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
        if (!$scope.$$phase) $scope.$apply(); // update the views
      }, 0);
    }
    !form_obj.bill && setDefaultBill();
  }
  /* end bootstrap */

  Client.listen('Stages: restart session', resetForm);
  Client.listen('Form: valid data', updateProspectModel);

  function updateProspectModel() {
    setTimeout(function(){
      if (!$scope.$$phase) $scope.$apply();
    }, 0)
  }

  function resetForm() {
    var obj = {};
    for (var prop in vm.prospect()) {
      if (vm.prospect().hasOwnProperty(prop)) {
        vm.prospect()[prop] = null;
        obj[prop] = null;
      }
    }
    User.isNew = true;
  }

  vm.days = [];

  for (var i = 1, len = 31; i <= len; i++) {
    vm.days.push(i);
  }

  vm.gmapShown = false;
  vm.invalidZip = false;
  vm.invalidTerritory = false;
  vm.validAddress = false;
  vm.isSubmitting = false;
  vm.NumberOfDays = vm.days.length;
  vm.focused = {};
  vm.showLabel = showLabel;
  vm.hideLabel = hideLabel;

  function isLeapYear (selectedYear) {
    var year = vm.prospect().year || 0;
    return ((year % 400 == 0 || year % 100 != 0) && (year % 4 == 0)) ? 1 : 0;
  }

  function getNumberOfDaysInMonth (selectedMonth) {
    var month = selectedMonth || 0;
    var days = 31 - ((month == 2) ? (3 - isLeapYear()) : ((month - 1) % 7 % 2));
    console.log("calculated", days, "for month", month);
    return days;
  }

  function updateNumberOfDays () {
    var month = vm.prospect().month;
    console.log("updating number of days for month", month);
    return vm.NumberOfDays = getNumberOfDaysInMonth(month);
  }

  function showLabel(field_name) {
    vm.focused[field_name] = true;
  }

  function hideLabel(field_name) {
    vm.focused[field_name] = false;
  }

  vm.prevStep = prev;
  vm.nextStep = next;
  vm.checkZip = checkZip;
  vm.saveBill = saveBill;
  vm.checkAddress = checkAddress;
  vm.checkCredit = checkCredit;
  vm.createContact = createContact;
  vm.skipConfigurator = skipConfigurator;
  vm.checkUtility = checkUtility;
  vm.updateNumberOfDays = updateNumberOfDays;

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
  Client.listen('Form: save utility', saveUtility);

  var old_zip,
      new_zip,
      old_street,
      new_street;

  function setDefaultBill () {
    vm.prospect().bill = defaultValues.bill;
    Client.emit('Form: valid data', { bill: vm.prospect().bill });
  }

  function checkZip (zip) {
    new_zip = vm.prospect().zip || zip;
    // console.log('********* checkin dat zip', new_zip, 'boss *********');
    /* jshint eqnull:true */
    if (new_zip != null && new_zip.length === 5) {
      // Only invalidate the street if the zip has changed - this allows the back button to function correctly
      if (vm.prospect().street) {
        vm.prospect().street = null;
        Form.ref() && Client.emit('Form: valid data', {street: null});
        Client.emit('Gmap: switch map type', 'terrain');
      }

      Geocoder.sendGeocodeRequest(new_zip);
    }
    else { return false; }
  }

  function checkAddress () {
    // TODO: ensure that form is pulling latest prospect from Firebase
    var addy;

    // console.log('********* checkin dat addy', new_street, 'boss *********');

    setTimeout(function() {
      if (!$scope.$$phase) $scope.$apply();
    }, 0);

    addy = {
      street: vm.prospect().street,
      city: vm.prospect().city,
      state: vm.prospect().state,
      zip: vm.prospect().zip,
    };

    Geocoder.sendGeocodeRequest(addy);
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
      vm.prospect().invalidTerritory = true;
      Client.emit('Form: valid data', { invalidTerritory: true });
    }
  }

  function checkCredit() {
    vm.isSubmitting = true;
    vm.leadPromise = vm.leadPromise || createLead(Salesforce.statuses.contact);

    saveDob();

    vm.leadPromise.then(function() {
      return checkAll({
        ContactId: vm.prospect().contactId,
        AddressId: vm.prospect().addressId,
        BirthDate: vm.prospect().dob
      });
    }).then(function(data) {
      vm.isSubmitting = false;
      vm.timedOut = false;

      if (data.CreditResultFound && !data.qualified) {
        vm.prospect().qualified = data.qualified;
        Client.emit('Form: valid data', { qualified: data.qualified });
        createLead(Salesforce.statuses.failCredit);
        Client.emit('Stages: stage', 'next');
      }
      else if (!data.CreditResultFound) {
        createLead(Salesforce.statuses.noCreditResult);
        Client.emit('Stages: jump to step', 'congrats');
      }
    }, function(resp) {
      createLead(Salesforce.statuses.networkError);
      vm.isSubmitting = false;

      // Timed out or failed
      Client.emit('Stages: jump to step', 'congrats');
    });
  }

  function saveDob() {
    vm.prospect().dob =[
      vm.prospect().month,
      vm.prospect().day,
      vm.prospect().year
    ].join('/');

    // TODO: remove this from production builds
    if (vm.prospect().email === CREDIT_FAIL.EMAIL) {
      vm.prospect().addressId = CREDIT_FAIL.ADDRESS_ID;
      vm.prospect().dob = CREDIT_FAIL.DOB;
    }

    vm.prospect().dob = moment(new Date(vm.prospect().dob)).format('MM/DD/YYYY');
    Client.emit('Form: valid data', {
      month: vm.prospect().month,
      day: vm.prospect().day,
      year: vm.prospect().year,
      dob: vm.prospect().dob
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
        vm.prospect().qualified = data.qualified;
        Client.emit('Form: valid data', { qualified: data.qualified });
        createLead(Salesforce.statuses.passCredit);
        result.qualified = true;
        vm.isSubmitting = false;
        vm.timedOut = false;

        if (vm.prospect().skipped && data.qualified) {
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
    var leadPromise;
    vm.isSubmitting = true;

    Client.emit('Form: valid data', {
      firstName: vm.prospect().firstName,
      lastName: vm.prospect().lastName,
      phone: vm.prospect().phone,
      email: vm.prospect().email
    });

    // Create a promise on the lead the first time it's created during contact creation
    if (vm.prospect().hasFinancingOptions) { 
      leadPromise = createLead(Salesforce.statuses.contact);
    } else {
      leadPromise = createLead(Salesforce.statuses.noFinancing);
    }

    vm.leadPromise = vm.leadPromise || leadPromise;

    Contact.create({
      Email: vm.prospect().email,
      FirstName: vm.prospect().firstName,
      LastName: vm.prospect().lastName,
      PhoneNumber: vm.prospect().phone,
      Address: {
        AddressLine1: vm.prospect().street,
        AddressLine2: '',
        City: vm.prospect().city,
        State: vm.prospect().state,
        Zip: vm.prospect().zip,
        Country: 'US',
        Latitude: vm.prospect().lat,
        Longitude: vm.prospect().lng
      }
    }).then(function(data) {
      vm.prospect().contactId = data.ContactId;
      vm.prospect().addressId = data.AddressId;
      vm.isSubmitting = false;
      vm.timedOut = false;

      Client.emit('Form: valid data', {
        contactId: vm.prospect().contactId,
        addressId: vm.prospect().addressId,
        firstName: vm.prospect().firstName,
        lastName: vm.prospect().lastName,
        phone: vm.prospect().phone,
        email: vm.prospect().email
      });

      if (vm.prospect().hasFinancingOptions) {
        Client.emit('Stages: jump to step', 'credit-check')
      } else {
        vm.prospect().qualified = false;
        Client.emit('Form: valid data', { qualified: false });
        Client.emit('Stages: jump to step', 'qualify');
      }
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
    createProposalLink();
    createSurveyLink();

    // TODO: handle duplicate error and bubble up feedback to user
    return Salesforce.createLead({
      // LeadSource: 'Online',
      // LastName: 'flannelflywheel',
      // OwnerId: '005300000058ZEZAA2',//oda userId,
      Company: 'flannelflywheel',
      LeadId: vm.prospect().leadId,
      FirstName: vm.prospect().firstName,
      LastName: vm.prospect().lastName || 'flannelflywheel',
      Email: vm.prospect().email,
      Phone: vm.prospect().phone,
      Street: vm.prospect().street,
      City: vm.prospect().city,
      State: vm.prospect().state,
      PostalCode: vm.prospect().zip,
      LeadStatus: leadStatus,
      UnqualifiedReason: unqualifiedReason,
      OdaHotloadLink: vm.prospect().odaHotloadLink,
      ProposalLink: vm.prospect().proposalLink,
      SiteSurveyLink: vm.prospect().siteSurveyLink,
      Skipped: vm.prospect().skipped,
      Share_Proposal_Link__c: vm.prospect().share_link,
      ExternalId: Session.id(),
      PanelCount: vm.prospect().panelCount,
      AverageYield: vm.prospect().averageYield,
      EstimatedProduction: vm.prospect().annualProduction,
      AverageMonthlyBill: vm.prospect().bill,
      UtilityRate: vm.prospect().utilityRate,
      SolarCityRate: vm.prospect().sctyRate,
      EstimatedFirstYearSavings: vm.prospect().firstYearSavings,
      EstimatedOffset: vm.prospect().percentSolar
    }).then(function(data) {
      if (data.id) {
        vm.prospect().leadId = data.id;
        Client.emit('Form: valid data', { leadId: vm.prospect().leadId });
      }
    });
  }

  function createHotloadLink() {
    vm.prospect().odaHotloadLink = [
      $location.protocol(),
      '://',
      URL_ROOT,
      '/#/oda/',
      Session.id()
    ].join('');
  }

  function createProposalLink() {
    vm.prospect().proposalLink = [
      $location.protocol(),
      '://',
      URL_ROOT,
      '/#/session/',
      Session.id(),
      '/proposal/review-proposal'
    ].join('');
  }

  function createSurveyLink() {
    vm.prospect().siteSurveyLink = [
      $location.protocol(),
      '://',
      URL_ROOT,
      '/#/session/',
      Session.id(),
      '/signup/qualify'
    ].join('');
  }

  function skipConfigurator() {
    vm.prospect().skipped = true;
    Client.emit('Form: valid data', { skipped: true });
    Client.emit('Stages: jump to stage', 'flannel.signup');
  }

  function checkUtility() {
    Client.emit('Spinner: spin it', true);

    getUtilities().then(function(data) {
      Client.emit('Spinner: spin it', false);

      // Only show the utilities modal when there's more than 1 utility to choose from
      if (data.length > 1) {
        Client.emit('Modal: show dialog', { dialog: 'utility', data: data });
      // Otherwise, save the first utility and get the rates for it
      } else if (data.length === 1) {
        saveUtility(data[0].UtilityId);
      }
    }, function() {
      Client.emit('Spinner: spin it', false);
      Client.emit('Stages: stage', 'next');
    });
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
      vm.prospect().lat = data.lat;
      vm.prospect().lng = data.lng;
      Client.emit('Form: valid data', data);
    } else vm.validLatLng = false;
    return vm.validLatLng;
  }

  function acceptValidWarehouse(data) {
    if (data) {
      vm.invalidTerritory = !data;
      vm.invalidZip = !data;

      Client.emit('Stages: jump to step', 'address-roof');
      vm.prospect().warehouseId = data.warehouseId;
      Client.emit('Form: valid data', {
        zip: data.zip,
        warehouseId: data.warehouseId
      });
    }
  }

  function acceptValidHouse(data) {
    // sync full address
    // accepting valid house
    if (data) {
      vm.invalid = false;
      vm.validAddress = true;
      vm.prospect().street = data.street;
      vm.prospect().zip = data.zip;
      vm.prospect().state = data.state;
      vm.prospect().city = data.city;
      Client.emit('Form: valid data', data);
      Client.emit('Stages: stage', 'next');
      // console.log('valid house accepted', data);
    }
  }

  function getUtilities() {
    return Utility.get({
      city: vm.prospect().city,
      zip: vm.prospect().zip
    });
  }

  function saveUtility (data) {
    // console.log(data);
    vm.prospect().utilityId = data;
    Client.emit('Form: valid data', {utilityId: data});
    Client.emit('Stages: stage', 'next');
    return getUtilityRates(data);
  }

  function getUtilityRates (id) {
    return Rates.get({ utilityid: id }).then(saveRates);
  }

  function saveRates (data) {
    // data returned from Rates API:
    // CashAvailable: true
    // FinancingKwhPrice: 0.15
    // LeaseAvailable: true
    // MedianUtilityPrice: 0.2233
    // MyPowerAvailable: true
    // PPAAvailable: true
    // UtilityAverageSystemEfficiency: 1468
    // UtilityID: 3

    var rateInfo;
    vm.prospect().utilityRate = data.MedianUtilityPrice;
    vm.prospect().sctyRate = data.FinancingKwhPrice;
    vm.prospect().averageYield = data.UtilityAverageSystemEfficiency;
    vm.prospect().hasFinancingOptions = data.LeaseAvailable || data.PPAAvailable;

    rateInfo = {
      utilityRate: vm.prospect().utilityRate,
      sctyRate: vm.prospect().sctyRate,
      averageYield: vm.prospect().averageYield,
      hasFinancingOptions: vm.prospect().hasFinancingOptions
    };

    Client.emit('Form: valid data', rateInfo);
  }

  function saveBill (data) {
    // console.log("bill", data);
    Client.emit('Form: valid data', { bill: data });
  }

  function acceptNeighborCount (data) {
    vm.prospect().neighbor_count = data ? data : "";
  }

  function acceptSavedEmail (data) {
    vm.prospect().email = data ? data : "";
  }
  function acceptSavedBirthdate (data) {
    vm.prospect().birthdate = data ? data : "";
  }
  function acceptSavedPhone (data) {
    vm.prospect().phone = data ? data : "";
  }
  function acceptSavedFullname (data) {
    vm.prospect().fullname = data ? data : "";
  }

  function acceptEmailFromShare(data) {
    vm.prospect().email = data;
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
