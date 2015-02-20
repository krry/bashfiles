controllers.controller('ScheduleCtrl', ['Form', 'Clientstream', '$q', '$http', 'UTILITIES_API', ScheduleCtrl_]);

function ScheduleCtrl_ (Form, Client, $q, $http, UTILITIES_API) {
  var vm = this;
  vm.prospect = Form.prospect;
  vm.eventDetails = eventDetails;
  vm.selectDate = selectDate;
  vm.selectTime = selectTime;
  vm.selectedDate = null;
  vm.init = init;
  vm.save = save;
  vm.init();

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
  }

  function selectTime(time) {
    if (vm.prospect.scheduledTime) {
      vm.prospect.scheduledTime.isSelected = false;
    }

    time.isSelected = true;
    vm.prospect.scheduledTime = time;
  }

  // TODO: replace mocked response with call to GSA api provider
  function getTimes() {
    var dfd = $q.defer();
    dfd.resolve([
      moment().add(1, 'day').format('M/DD/YYYY h:mm:ssA'),
      moment().add(2, 'day').format('M/DD/YYYY h:mm:ssA'),
      '2/18/2015 11:00:00AM',
      '2/19/2015 11:00:00AM',
      '2/20/2015 9:00:00AM',
      '2/20/2015 11:00:00AM',
      '2/23/2015 9:00:00AM',
      '2/23/2015 11:00:00AM',
      '2/27/2015 7:00:00AM',
      '2/27/2015 11:00:00AM',
      '3/2/2015 9:00:00AM'
    ]);

    return dfd.promise;
  }

  // TODO: replace mocked response with call to GSA api provider
  function scheduleTime() {
    var dfd = $q.defer();
    dfd.resolve('success');
    return dfd.promise;
  }

  function save() {
    scheduleTime().then(function() {
      Client.emit('stage', "next");
    });
  }

  function init() {
    return getTimes().then(parseTimes);
  }

  function parseTimes(data) {
    vm.availableTimes = [];

    angular.forEach(data, function(date) {
      date = moment(date, 'MM/D/YYYY h:mm:ssA');
      vm.availableTimes.push(date);
    });

    vm.config.startDate = vm.availableTimes[0].format('MM/D/YYYY');
  }
}
