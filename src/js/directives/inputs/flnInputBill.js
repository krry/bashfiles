directives.directive('flnInputBill', [flnInputBill_]);

function flnInputBill_ () {
  return {
    restrict: "A",
    templateUrl: "templates/directives/inputs/flnInputBill.html",
    require: "^flnForm",
  };
}
