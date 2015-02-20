directives.directive('flnInputBillSlider', [flnInputBillSlider_]);

function flnInputBillSlider_ () {
  return {
    scope: {
      hint: "@"
    },
    restrict: "E",
    controller: "FormCtrl as form",
    templateUrl: "templates/directives/inputs/flnInputBillSlider.html",
  };
}
