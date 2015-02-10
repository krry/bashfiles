directives.directive('flnTimeSelection', [flnTimeSelection_]);

function flnTimeSelection_ () {
  return {
    templateUrl: 'templates/directives/flnTimeSelection.html',
    controller: 'CalendarCtrl',
    controllerAs: 'calendar'
  };
}