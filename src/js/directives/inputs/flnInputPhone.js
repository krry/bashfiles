directives.directive('flnInputPhone', [flnInputPhone_]);

function flnInputPhone_ () {
  return {
    scope: {
      hint: "@"
    },
    restrict: "E",
    templateUrl: "templates/directives/inputs/flnInputPhone.html",
    controller: "FormCtrl as form"
  };
}
