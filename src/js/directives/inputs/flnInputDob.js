directives.directive('flnInputDob', ["Form", flnInputDob_]);

function flnInputDob_ (Form) {
  return {
    scope: {
      hint: "@"
    },
    restrict: "E",
    templateUrl: "templates/directives/inputs/flnInputDob.html",
    controller: "FormCtrl as form",
  };
}
