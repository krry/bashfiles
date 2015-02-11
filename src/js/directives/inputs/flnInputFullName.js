directives.directive('flnInputFullName', ["Form", flnInputFullName_]);

function flnInputFullName_ (Form) {
  return {
    scope: {
      hint: "@"
    },
    restrict: "E",
    templateUrl: "templates/directives/inputs/flnInputFullName.html",
    controller: "FormCtrl as form"
  };
}
