directives.directive('flnTimeSelection', [flnTimeSelection_]);

function flnTimeSelection_ () {
  return {
    templateUrl: 'templates/directives/flnTimeSelection.html',
    controller: 'ScheduleCtrl',
    controllerAs: 'schedule'
  };
}