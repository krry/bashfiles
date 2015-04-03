directives.directive('flnInputBillSlider', ['Form', flnInputBillSlider_]);

function flnInputBillSlider_ (Form) {
  return {
    restrict: "E",
    templateUrl: "templates/directives/inputs/flnInputBillSlider.html",
    require: '^flnForm',
    link: function (scope, element, attrs, FormCtrl) {
      var prospect = FormCtrl.prospect;
      scope.prosposalBill = attrs.proposalBill;

      $('#bill-slider').on({
        slide: function () {
          FormCtrl.billChanged = true;
          FormCtrl.saveBill(prospect().bill);
          if (!scope.$$phase) scope.$apply();
        }
      });
    }
  };
}
