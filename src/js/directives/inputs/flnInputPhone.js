directives.directive('flnInputPhone', [flnInputPhone_]);
//
function flnInputPhone_ () {
  return {
    restrict: "E",
    templateUrl: "templates/directives/inputs/flnInputPhone.html",
    require: '^flnForm',
  };
}
