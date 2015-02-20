directives.directive('flnInputBill', [flnInputBill_]);

function flnInputBill_ () {
  return {
    scope: {
      hint: "@"
    },
    restrict: "A",
    controller: "FormCtrl as form",
    templateUrl: "templates/directives/inputs/flnInputBill.html",
    link: function (scope, element, attrs) {
      $(element).focus();
    }
  };
}
