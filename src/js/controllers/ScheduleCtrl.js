controllers.controller('ScheduleCtrl', ['Form', 'Clientstream', '$q', 'SiteSurvey', ScheduleCtrl_]);

function ScheduleCtrl_ (Form, Client, $q, SiteSurvey) {
  var vm = this;
  vm.prospect = Form.prospect;
  vm.eventDetails = eventDetails;
  vm.selectDate = selectDate;
  vm.selectTime = selectTime;
  vm.selectedDate = null;
  vm.availableTimes = [];
  vm.init = init;
  vm.check = check;
  vm.save = save;

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
    return SiteSurvey.scheduleTime().then(function() {
      Client.emit('stage', 'next');
    });
  }

  function init() {
    return SiteSurvey.getTimes().then(parseTimes);
  }

  function check() {
    return SiteSurvey.getTimes().then(checkTimes);
  }

  function parseTimes(data) {
    vm.availableTimes = [];

    angular.forEach(data, function(date) {
      date = moment(date, 'MM/D/YYYY h:mm:ssA');
      vm.availableTimes.push(date);
    });

    vm.config.startDate = vm.availableTimes[0].format('MM/D/YYYY');
  }

  function checkTimes(data) {
    // Immediately redirect to congrats page if no times available
    if (!data.length) {
      Client.emit('jump to step', 'congrats'); 
    } else {
      Client.emit('stage', 'next');
    }
  }
}
