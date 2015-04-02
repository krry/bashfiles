directives.directive('flnInputBill', ['defaultValues', flnInputBill_]);

function flnInputBill_ (defaultValues) {
  return {
    restrict: "A",
    templateUrl: "templates/directives/inputs/flnInputBill.html",
    require: "^flnForm",
    link: function (scope, element, attrs, FormCtrl) {
      var prospect = FormCtrl.prospect;
      if (!prospect().bill) {
        prospect().bill = defaultValues.bill;
      }

      element.find('input').bind('change', function () {
        FormCtrl.saveBill(prospect().bill);
      })
    }
  };
}
