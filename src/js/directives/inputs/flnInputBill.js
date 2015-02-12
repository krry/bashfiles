directives.directive('flnInputBill', ["Form", flnInputBill_]);

function flnInputBill_ (Form) {
  return {
    scope: {
      hint: "@"
    },
    restrict: "E",
    templateUrl: "templates/directives/inputs/flnInputBill.html",
    controller: "FormCtrl as form",
    link: function (scope, element, attrs) {
      $(element).focus();
    }
  };
}
