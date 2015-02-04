directives.directive('flnSpinner', flnSpinner);

function flnSpinner () {
  return {
    restrict: "E",
    replace: "true",
    templateUrl: 'templates/directives/flnSpinner.html',
  };
}
