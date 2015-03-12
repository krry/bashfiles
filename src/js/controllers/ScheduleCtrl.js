/* =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-

  Schedule controller

  Uses data from Warehouses, Contact, and Utility APIs
  Populates the view with available appointments

=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=- */

controllers.controller('ScheduleCtrl', ['Form', 'Clientstream', 'Session', 'SiteSurvey', 'Installation', 'Salesforce', ScheduleCtrl_]);

function ScheduleCtrl_ (Form, Client, Session, SiteSurvey, Installation, Salesforce) {
  var vm = this;
  vm.prospect = Form.prospect;
  vm.eventDetails = eventDetails;
  vm.selectDate = selectDate;
  vm.selectTime = selectTime;
  vm.selectedDate = null;
  vm.availableTimes = [];
  vm.check = check;
  vm.init = init;
  vm.save = save;
  vm.createInstallation = createInstallation;

  vm.config = {
    startDate: moment().format('MM/D/YYYY'),
    range: 21
  };

  function eventDetails() {
    var obj = moment(new Date(vm.prospect.scheduledTime.date)),
        format = 'MM/DD/YYYY h:mm:ss A';

    return {
      subject: 'SolarCity site survey',
      begin: obj.format(format),
      end: obj.clone().add(2, 'hours').format(format),
      location: [
        vm.prospect.street,
        vm.prospect.city,
        [vm.prospect.state, vm.prospect.zip].join(' ')
      ].join(', '),
      description: [
        'A site surveyor will come to your house.',
        'Someone over 18 must be home to open the door and answer any questions.',
        'The site surveyor will study your roof as well as your current energy consumption.',
        'This will take 1-2 hours, but you only need to be there to answer the door.'
      ].join(' ')
    };
  }

  function selectDate(date) {
    if (vm.selectedDate) {
      vm.selectedDate.isClicked = false;
    }

    if (date.availableTimes.length > 0 && date.canSchedule) {
      vm.prospect.scheduledDate = date;
      Client.emit('Stages: stage', 'next');
    } else {
      date.isClicked = true;
    }

    vm.selectedDate = date;
    vm.prospect.scheduledTime = null;

    if (date.availableTimes.length === 1) {
      selectTime(date.availableTimes[0]);
    }
  }

  function selectTime(time) {
    if (vm.prospect.scheduledTime) {
      vm.prospect.scheduledTime.isSelected = false;
    }

    time.isSelected = true;
    vm.prospect.scheduledTime = time;
  }

  function save() {
    vm.isSubmitting = true;

    return SiteSurvey.scheduleTime({
      installationGuid: vm.prospect.installationGuid,
      dateTime: moment(new Date(vm.prospect.scheduledTime.date)).format(SiteSurvey.timeFormat)
    }).then(function() {
      vm.timedOut = false;
      createLead(Salesforce.statuses.scheduledSiteSurvey);

      Client.emit('Form: valid data', {
        // Strip out Angular's $$hash key
        scheduledTime: JSON.parse(angular.toJson(vm.prospect.scheduledTime))
      });
      Client.emit('Stages: stage', 'next');
    }, function(resp) {
      vm.isSubmitting = false;

      if (resp.status === 0) {
        vm.timedOut = true;
      }
    });
  }

  function createLead(leadStatus, unqualifiedReason) {
    return Salesforce.createLead({
      LeadId: vm.prospect.leadId,
      FirstName: vm.prospect.firstName,
      LastName: vm.prospect.lastName,
      Email: vm.prospect.email,
      Phone: vm.prospect.phone,
      Street: vm.prospect.home,
      City: vm.prospect.city,
      State: vm.prospect.state,
      PostalCode: vm.prospect.zip,
      LeadStatus: leadStatus,
      UnqualifiedReason: unqualifiedReason,
      //OwnerId: '005300000058ZEZAA2',//oda userId
      ExternalId: Session.id()
    });
  }

  function init() {
    return SiteSurvey.getTimes({
      installationGuid: vm.prospect.installationGuid
    }).then(parseTimes);
  }

  function parseTimes(data) {
    vm.availableTimes = [];

    angular.forEach(data, function(date) {
      date = moment(date, SiteSurvey.timeFormat);
      vm.availableTimes.push(date);
    });

    vm.config.startDate = vm.availableTimes[0].format('MM/D/YYYY');
    return vm.availableTimes;
  }

  function check() {
    return createInstallation().then(getSchedule);
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
    Client.emit('Stages: jump to step', 'congrats');
  }

  function createInstallation() {
    vm.isSubmitting = true;

    return Installation.create({
      OfficeId: vm.prospect.warehouseId,
      ContactId: vm.prospect.contactId,
      AddressId: vm.prospect.addressId,
      UtilityId: vm.prospect.utilityId
    }).then(storeInstallation, skipScheduling);
  }

  function storeInstallation(data) {
    vm.prospect.installationGuid = data.InstallationGuid;
    Client.emit('Form: valid data', { installationGuid: vm.prospect.installationGuid });
  }
}
