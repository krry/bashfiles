directives.directive('flnInputDobYear', [flnInputDobYear_]);

function flnInputDobYear_ () {
  return {
    templateUrl: "templates/directives/inputs/flnInputDobYear.html",
    require: '^flnForm',
  };
}
