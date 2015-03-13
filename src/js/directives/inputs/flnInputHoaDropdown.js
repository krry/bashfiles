directives.directive('flnInputHoaDropdown', [flnInputHoaDropdown_]);

function flnInputHoaDropdown_ () {
  return {
    restrict: "E",
    templateUrl: "templates/directives/inputs/flnInputHoaDropdown.html",
    require: '^flnForm',
  };
}
