directives.directive('flnSpinner', flnSpinner);

function flnSpinner () {
  return {
    restrict: "E",
    replace: "true",
    templateUrl: 'templates/directives/widgets/flnSpinner.html',
  };
}
