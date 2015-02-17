directives.directive('flnInputBill', [flnInputBill_]);

function flnInputBill_ () {
  return {
    scope: {
      hint: "@"
    },
    restrict: "A",
    templateUrl: "templates/directives/inputs/flnInputBill.html",
    // controller: function () {
      // TODO: instead of importing the whole FormCtrl, write a custom controller that only consumes the Form model piece relevant to the directive
    // }
    link: function (scope, element, attrs) {
      $(element).focus();
    }
  };
}
