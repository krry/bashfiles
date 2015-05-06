directives.directive('flnInputDobMonth', [flnInputDobMonth_]);

function flnInputDobMonth_ () {
  return {
    templateUrl: "templates/directives/inputs/flnInputDobMonth.html",
    require: '^flnForm',
  };
}
