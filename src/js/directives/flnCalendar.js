directives.directive('flnCalendar', [flnCalendar_]);

function flnCalendar_ () {
  return {
    templateUrl: 'templates/directives/flnCalendar.html',
    scope: {
      config: '=config',
      availableTimes: '=availableTimes',
      selectFn: '&selectFn'
    },
    controller: 'CalendarCtrl as calendar'
  };
}