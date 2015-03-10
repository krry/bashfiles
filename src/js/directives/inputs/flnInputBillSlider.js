directives.directive('flnInputBillSlider', [flnInputBillSlider_]);

function flnInputBillSlider_ () {
  return {
    restrict: "E",
    templateUrl: "templates/directives/inputs/flnInputBillSlider.html",
    require: '^flnForm',
  };
}
