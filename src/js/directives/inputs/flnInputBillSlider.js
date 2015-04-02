directives.directive('flnInputBillSlider', ['Form', flnInputBillSlider_]);

function flnInputBillSlider_ (Form) {
  return {
    restrict: "E",
    templateUrl: "templates/directives/inputs/flnInputBillSlider.html",
    require: '^flnForm',
    link: function (scope, element, attrs, FormCtrl) {
      var prospect = FormCtrl.prospect;

      $('#bill-slider').on({
        change: function () {
          FormCtrl.saveBill(prospect().bill);
        }
      });
    }
  };
}
