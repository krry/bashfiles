directives.directive('flnCalendar', [flnCalendar_]);

function flnCalendar_ () {
  return {
    templateUrl: 'templates/directives/flnCalendar.html',
    scope: {
      config: '=config',
      availableTimes: '=availableTimes',
      selectFn: '&selectFn'
    },
    link: function(scope, element, attrs) {
      scope.days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      scope.isAvailable = isAvailable;

      scope.$watch('config', function() {
        scope.dates = getDates(scope.config.startDate, scope.config.range);
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

        startDate = moment(new Date(startDate));

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
        scope.rows = range(1, Math.ceil(dayRange / 7));
      }

      function parseAvailableTimes(times) {
        var dates = scope.dates,
            timeDiff, selectedTimestamp, availableTimestamp;

        // Timestamp comparison is noticeably faster than using moment().isSame()
        for (var i = 0, datesLen = dates.length; i < datesLen; i++) {
          dates[i].availableTimes.length = 0;
          selectedTimestamp = parseInt(dates[i].obj.format('X'), 10);

          for (var j = 0, timesLen = times.length; j < timesLen; j++) {
            availableTimestamp = parseInt(times[j].format('X'), 10);
            timeDiff = availableTimestamp - selectedTimestamp;

            if (timeDiff > 0 && timeDiff < (60 * 60 * 24)) {
              dates[i].availableTimes.push(times[j]);
            }
          }
        }
      }

      function isAvailable(date) {
        return date.availableTimes.length > 0;
      }
    }
  };
}