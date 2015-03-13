directives.directive('flnInputAttic', [flnInputAttic_]);

function flnInputAttic_ () {
  return {
    restrict: "E",
    templateUrl: "templates/directives/inputs/flnInputAttic.html",
    require: '^flnForm',
  };
}
