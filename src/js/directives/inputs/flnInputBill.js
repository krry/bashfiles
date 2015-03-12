directives.directive('flnInputBill', ["defaultValues", "Form", flnInputBill_]);

function flnInputBill_ (defaultValues, Form) {
  return {
    restrict: "A",
    templateUrl: "templates/directives/inputs/flnInputBill.html",
    require: "^flnForm",
    link: function (scope, element, attrs) {
      var prospect = Form.prospect
      if (!prospect.bill) {
        prospect.bill = defaultValues.bill;
      }
    }
  };
}
