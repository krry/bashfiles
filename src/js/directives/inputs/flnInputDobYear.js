directives.directive('flnInputDobYear', [flnInputDobYear_]);

function flnInputDobYear_ () {
  return {
    restrict: "E",
    templateUrl: "templates/directives/inputs/flnInputDobYear.html",
    require: '^flnForm',
  };
}
