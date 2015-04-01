controllers.controller('CalendarCtrl', ['$scope', CalendarCtrl_]);

function CalendarCtrl_ (scope) {
  var vm = this;
  vm.days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  vm.isAvailable = isAvailable;
  vm.getTooltip = getTooltip;

  scope.$watch('config', function() {
    vm.dates = getDates(scope.config.startDate, scope.config.range);
    setRows(scope.config.range);
  });

  scope.$watch('availableTimes', parseAvailableTimes);

  function range(start, end) {
    var arr = [];

    for (var i = start; i <= end; i++) {
      arr.push(i);
    }

    return arr;
  }

  function getDates(startDate, range) {
    var dates = [],
        date;

    startDate = moment(new Date(startDate)).startOf('week');

    for (var i = 0; i < range; i++) {
      date = startDate.clone().add(i, 'days');

      dates.push({
        day: date.format('D'),
        month: date.format('MMM'),
        obj: date,
        availableTimes: []
      });
    }

    return dates;
  }

  function setRows(dayRange) {
    vm.rows = range(1, Math.ceil(dayRange / 7));
  }

  function parseAvailableTimes(times) {
    var dates = vm.dates,
        today = parseInt(moment().format('X'), 10),
        timeDiff, selectedTimestamp, availableTimestamp;

    // Timestamp comparison is noticeably faster than using moment().isSame()
    for (var i = 0, datesLen = dates.length; i < datesLen; i++) {
      dates[i].availableTimes.length = 0;
      selectedTimestamp = parseInt(dates[i].obj.format('X'), 10);

      // Can't schedule a day less than 48 hours away
      if (Math.abs(today - selectedTimestamp) < (60 * 60 * 48)) {
        dates[i].canSchedule = false;
      } else {
        dates[i].canSchedule = true;
      }

      for (var j = 0, timesLen = times.length; j < timesLen; j++) {
        availableTimestamp = parseInt(times[j].format('X'), 10);
        timeDiff = availableTimestamp - selectedTimestamp;

        if (timeDiff > 0 && timeDiff < (60 * 60 * 24)) {
          dates[i].availableTimes.push({
            date: times[j].format('MM/DD/YYYY h:mm:ss A'),
            start: times[j].format('h A'),
            end: times[j].clone().add(2, 'hours').format('h A'),
            month: times[j].format('MMM'),
            day: times[j].format('D'),
            weekday: times[j].format('dddd')
          });
        }
      }
    }
  }

  function isAvailable(date) {
    return date.availableTimes.length > 0;
  }

  function getTooltip(date) {
    if (isAvailable(date) && !date.canSchedule) {
      return 'Appointments in the next 48 hours must be done over the phone. Call (650) 288-0975.';
    }

    if (isAvailable(date)) {
      return 'This date is available.';
    }

    return 'This date is unavailable.';
  }
}
