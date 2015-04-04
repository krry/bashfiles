directives.directive('flnInputBill', ['defaultValues', flnInputBill_]);

function flnInputBill_ (defaultValues) {
  return {
    restrict: "A",
    templateUrl: "templates/directives/inputs/flnInputBill.html",
    require: "^flnForm",
    link: function (scope, element, attrs, FormCtrl) {
      var prospect = FormCtrl.prospect;
      scope.prosposalBill = attrs.proposalBill;

      if (!prospect().bill) {
        prospect().bill = defaultValues.bill;
      }
      element.find('input').bind('change', function () {
        FormCtrl.billChanged = true;
        FormCtrl.saveBill(prospect().bill);
        if (!scope.$$phase) scope.$apply();
      });
    }
  };
}
