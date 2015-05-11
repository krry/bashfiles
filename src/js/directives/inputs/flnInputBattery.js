directives.directive('flnInputBattery', [flnInputBattery_]);

function flnInputBattery_ () {
  return {
    restrict: "E",
    templateUrl: "templates/directives/inputs/flnInputBattery.html",
    require: '^flnForm',
  };
}
