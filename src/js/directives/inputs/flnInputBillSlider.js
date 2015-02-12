directives.directive('flnInputBillSlider', [flnInputBillSlider_]);

function flnInputBillSlider_ () {
  return {
    scope: {
      hint: "@"
    },
    restrict: "E",
    templateUrl: "templates/directives/inputs/flnInputBillSlider.html",
    controller: "FormCtrl as form"
  };
}
