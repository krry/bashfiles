directives.directive('flnInputZip', [flnInputZip_]);

function flnInputZip_ () {
  return {
    restrict: "E",
    templateUrl: "templates/directives/inputs/flnInputZip.html",
    require: '^flnForm',
  };
}
