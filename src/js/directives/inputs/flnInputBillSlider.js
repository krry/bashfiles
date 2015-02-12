directives.directive('flnInputBillSlider', ["Form", flnInputBillSlider_]);

function flnInputBillSlider_ (Form) {
  return {
    scope: {
      hint: "@"
    },
    restrict: "E",
    templateUrl: "templates/directives/inputs/flnInputBillSlider.html",
    controller: "FormCtrl as form",
  };
}
