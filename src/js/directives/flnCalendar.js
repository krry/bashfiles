directives.directive('flnCalendar', [flnCalendar_]);

function flnCalendar_ () {
  return {
    templateUrl: 'templates/directives/flnCalendar.html',
    scope: {
      config: '=config'
    },
    link: function(scope, element, attrs) {
      scope.days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      scope.$watch('config', function() {
        scope.dates = getDates(scope.config.startDate, scope.config.range);
        setRows(scope.config.range);
      });

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
          dates.push({
            day: startDate.clone().add(i, 'days').format('D')
          });
        }

        return dates;
      }

      function setRows(dayRange) {
        scope.rows = range(1, Math.ceil(dayRange / 7));
      }
    }
  };
}