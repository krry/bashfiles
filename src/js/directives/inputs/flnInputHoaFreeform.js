directives.directive('flnInputHoaFreeform', [flnInputHoaFreeform_]);

function flnInputHoaFreeform_ () {
  return {
    restrict: "E",
    templateUrl: "templates/directives/inputs/flnInputHoaFreeform.html",
    require: '^flnForm',
  };
}
