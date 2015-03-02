controllers.controller('ScheduleCtrl', ['Form', 'Clientstream', 'SiteSurvey', 'Installation', ScheduleCtrl_]);

function ScheduleCtrl_ (Form, Client, SiteSurvey, Installation) {
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
    return {
      subject: 'SolarCity site survey',
      begin: vm.prospect.scheduledTime.obj.format('MM/DD/YYYY h:mm:ss A'),
      end: vm.prospect.scheduledTime.obj.clone().add(2, 'hours').format('MM/DD/YYYY h:mm:ss A'),
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
      Client.emit('stage', 'next');
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
    console.log(vm.prospect.scheduledTime);
    return SiteSurvey.scheduleTime({
      installationGuid: vm.prospect.installationGuid,
      dateTime: vm.prospect.scheduledTime.obj.format(SiteSurvey.timeFormat)
    }).then(function() {
      Client.emit('stage', 'next');
    });
  }

  function init() {
    // TODO: remove the hard coded guid once the installation POST error clears up
    vm.prospect.installationGuid = 'CD41ADEE-4AE9-40EB-B2CD-2AE72E8EABC6';
    return SiteSurvey.getTimes({
      installationGuid: vm.prospect.installationGuid
    }).then(parseTimes, skipScheduling);
  }
                          
  function check() {
    return createInstallation().then(init).then(checkTimes);
  }

  function parseTimes(data) {
    vm.availableTimes = [];

    angular.forEach(data, function(date) {
      date = moment(date, SiteSurvey.timeFormat);
      vm.availableTimes.push(date);
    });

    vm.config.startDate = vm.availableTimes[0].format('MM/D/YYYY');
  }

  function skipScheduling() {
    Client.emit('jump to step', 'congrats');
  }

  function checkTimes(data) {
    // Immediately redirect to congrats page if no times available
    if (!data || !data.length) {
      Client.emit('jump to step', 'congrats'); 
    } else {
      Client.emit('stage', 'next');
    }
  }

  function createInstallation() {
    vm.isSubmitting = true;

    Installation.create({
      OfficeId: vm.prospect.warehouseId,
      ContactId: vm.prospect.contactId,
      AddressId: vm.prospect.addressId,
      UtilityId: vm.prospect.utilityId
    }).then(function(data) {
      // TODO: store data from response when api is working
      console.log(data);
    }, function() {
      Client.emit('jump to step', 'congrats');
    });
  }
}
