directives.directive('flnInputDobMonth', [flnInputDobMonth_]);

function flnInputDobMonth_ () {
  return {
    restrict: "E",
    templateUrl: "templates/directives/inputs/flnInputDobMonth.html",
    require: '^flnForm',
  };
}
