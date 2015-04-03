/* =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-

  Schedule controller

  Uses data from Warehouses, Contact, and Utility APIs
  Populates the view with available appointments

=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=- */

controllers.controller('ScheduleCtrl', ['Form', 'Clientstream', 'Session', 'SiteSurvey', 'Installation', 'Salesforce', 'Ahj', 'SurveyQuestions', ScheduleCtrl_]);

function ScheduleCtrl_ (Form, Client, Session, SiteSurvey, Installation, Salesforce, Ahj, SurveyQuestions) {
  var vm = this;
  vm.prospect = Form.prospect;
  vm.eventDetails = eventDetails;
  vm.selectDate = selectDate;
  vm.selectTime = selectTime;
  vm.selectedDate = null;
  vm.availableTimes = [];
  vm.HOAs = [];
  vm.selectedAhj = { id: -1 };
  vm.check = check;
  vm.init = init;
  vm.save = save;
  vm.createInstallation = createInstallation;
  vm.answeredQuestions = answeredQuestions;
  vm.getHOAs = getHOAs;
  vm.checkHOA = checkHOA;
  vm.saveAnswers = saveAnswers;
  vm.skipScheduling = skipScheduling;

  Client.listen('Form: Loaded', init);

  vm.config = {
    startDate: moment().format('MM/D/YYYY'),
    range: 21
  };

  function eventDetails() {
    var obj = moment(new Date(vm.prospect().scheduledTime.date)),
        format = 'MM/DD/YYYY h:mm:ss A';

    return {
      subject: 'SolarCity site survey',
      begin: obj.format(format),
      end: obj.clone().add(2, 'hours').format(format),
      location: [
        vm.prospect().street,
        vm.prospect().city,
        [vm.prospect().state, vm.prospect().zip].join(' ')
      ].join(', '),
      description: [
        'A SolarCity site surveyor will arrive at your home during this 2-hour window.',
        'We’ll need someone over 18 present for the entirety of the appointment, which should last 1-2 hours.',
        'The surveyor will need access to your roof, attic, electrical panel and internet connection.',
        'We will take detailed measurements of your home and assess your current energy consumption to design a system that is customized for your needs.',
        'CONGRATULATIONS ON TAKING THE NEXT STEP TOWARD GOING SOLAR!'
      ].join(' ')
    };
  }

  function selectDate(date) {
    if (vm.selectedDate) {
      vm.selectedDate.isClicked = false;
    }

    if (date.availableTimes.length > 0 && date.canSchedule) {
      vm.prospect().scheduledDate = date;
      Client.emit('Stages: stage', 'next');
    } else {
      date.isClicked = true;
    }

    vm.selectedDate = date;
    vm.prospect().scheduledTime = null;

    if (date.availableTimes.length === 1) {
      selectTime(date.availableTimes[0]);
    }
  }

  function selectTime(time) {
    if (vm.prospect().scheduledTime) {
      vm.prospect().scheduledTime.isSelected = false;
    }

    time.isSelected = true;
    vm.prospect().scheduledTime = time;
  }

  function save() {
    vm.isSubmitting = true;

    return SiteSurvey.scheduleTime({
      installationGuid: vm.prospect().installationGuid,
      dateTime: moment(new Date(vm.prospect().scheduledTime.date)).format(SiteSurvey.timeFormat)
    }).then(function() {
      vm.timedOut = false;
      Client.emit('Form: save lead', Salesforce.statuses.scheduledSiteSurvey);

      Client.emit('Form: valid data', {
        // Strip out Angular's $$hash key
        scheduledTime: JSON.parse(angular.toJson(vm.prospect().scheduledTime))
      });
      Client.emit('Stages: stage', 'next');
    }, function(resp) {
      vm.isSubmitting = false;

      if (resp.status === 0) {
        vm.timedOut = true;
      }
    });
  }

  function init() {
    if (!vm.prospect().installationGuid) {
      return;
    }

    vm.isSubmitting = true;

    return SiteSurvey.getTimes({
      installationGuid: vm.prospect().installationGuid
    }).then(parseTimes);
  }

  function parseTimes(data) {
    vm.availableTimes = [];

    angular.forEach(data, function(date) {
      date = moment(date, SiteSurvey.timeFormat);
      vm.availableTimes.push(date);
    });

    vm.config.startDate = vm.availableTimes[0].format('MM/D/YYYY');
    vm.isSubmitting = false;
    return vm.availableTimes;
  }

  function check() {
    return createInstallation().then(createFullInstallation).then(getSchedule);
  }

  function getSchedule() {
    return init().then(checkTimes, skipScheduling);
  }

  function checkTimes(data) {
    // Immediately redirect to congrats page if no times available
    var step = (!data || !data.length) ? 'congrats' : 'survey-calendar';
    Client.emit('Stages: jump to step', step);
  }

  function skipScheduling() {
    if (vm.prospect().scheduledTime) {
      vm.prospect().scheduledTime.isSelected = false;
      vm.prospect().scheduledTime = false;
    }
    
    Client.emit('Stages: jump to step', 'congrats');
  }

  function createInstallation() {
    vm.isSubmitting = true;

    return Installation.create({
      OfficeId: vm.prospect().warehouseId,
      ContactId: vm.prospect().contactId,
      AddressId: vm.prospect().addressId,
      UtilityId: vm.prospect().utilityId
    }).then(storeInstallation, skipScheduling);
  }

  function createFullInstallation() {
    Installation.create({
      FullInstallation: true,
      InstallationGuid: vm.prospect().installationGuid,
      LeadId: vm.prospect().leadId
    });
  }

  function storeInstallation(data) {
    vm.prospect().installationGuid = data.InstallationGuid;
    Client.emit('Form: valid data', { installationGuid: vm.prospect().installationGuid });
  }

  function answeredQuestions() {
    /* jshint eqnull:true */
    var hasAnsweredQuestions = (vm.prospect().hoa != null && vm.prospect().pets != null && vm.prospect().attic != null),
        hasSelectedHOA = vm.prospect().hoa ? (vm.prospect().ahjId != null || vm.prospect().hoaName != null) : true;

    return (hasAnsweredQuestions && hasSelectedHOA);
  }

  function getHOAs() {
    Ahj.get({
      latitude: vm.prospect().lat,
      longitude: vm.prospect().lng
    }).then(function(data) {
      if (data.length > 0) {
        populateHOAs(data);
      }
    });
  }

  function populateHOAs(data) {
    data.sort(function(x, y) {
      return (x.AHJName > y.AHJName) ? 1 : (x.AHJName < y.AHJName) ? -1 : 0;
    });

    vm.HOAs.length = 0;
    vm.HOAs.push({ AHJName: 'Select your homeowners association', id: 0 });
    vm.HOAs.push.apply(vm.HOAs, data);
    vm.HOAs.push({ AHJName: 'None of the above', id: -1 });
    vm.selectedAhj = vm.HOAs[0];
  }

  function checkHOA(id) {
    vm.prospect().hoaName = (id < 0) ? '' : null;
    vm.prospect().ahjId = (id > 0) ? id : null;
  }

  function saveAnswers() {
    vm.isSubmitting = true;

    SurveyQuestions.save({
      InstallationGUID: vm.prospect().installationGuid,
      AtticAccessible: vm.prospect().attic,
      HasPets: vm.prospect().pets,
      BelongsToHOA: vm.prospect().hoa,
      AhjID: vm.prospect().ahjId,
      HoaName: vm.prospect().hoaName
    }).then(function() {
      vm.isSubmitting = false;
      vm.timedOut = false;
      Client.emit('Stages: stage', 'next');
    }, function(resp) {
      vm.isSubmitting = false;

      if (resp.status === 0) {
        vm.timedOut = true;
      }
    });
  }
}
