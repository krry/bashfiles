directives.directive('flnInputDobDay', [flnInputDobDay_]);

function flnInputDobDay_ () {
  return {
    restrict: "E",
    templateUrl: "templates/directives/inputs/flnInputDobDay.html",
    require: '^flnForm',
  };
}
