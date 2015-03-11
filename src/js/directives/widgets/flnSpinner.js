directives.directive('flnSpinner', [flnSpinner_]);

function flnSpinner_ () {
  return {
    restrict: 'E',
    replace: 'true',
    templateUrl: 'templates/directives/widgets/flnSpinner.html',
  };
}
