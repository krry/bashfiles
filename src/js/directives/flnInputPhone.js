directives.directive('flnInputPhone', ["Form", flnInputPhone_]);

function flnInputPhone_ (Form) {
  return {
    scope: {
      hint: "@"
    },
    restrict: "E",
    templateUrl: "templates/directives/flnInputPhone.html",
    controller: "FormCtrl as form"
  };
}
