directives.directive('flnInputBill', [flnInputBill_]);

function flnInputBill_ () {
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
