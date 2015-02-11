directives.directive('flnInputPhone', ["Form", flnInputPhone_]);

function flnInputPhone_ (Form) {
  return {
    scope: {
      hint: "@"
    },
    restrict: "E",
    templateUrl: "templates/directives/inputs/flnInputPhone.html",
    controller: "FormCtrl as form"
  };
}
