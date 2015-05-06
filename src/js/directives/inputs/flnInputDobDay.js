directives.directive('flnInputDobDay', [flnInputDobDay_]);

function flnInputDobDay_ () {
  return {
    templateUrl: "templates/directives/inputs/flnInputDobDay.html",
    require: '^flnForm',
  };
}
