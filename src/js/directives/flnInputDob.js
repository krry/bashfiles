directives.directive('flnInputDob', ["Form", flnInputDob_]);

function flnInputDob_ (Form) {
  return {
    scope: {
      hint: "@"
    },
    restrict: "E",
    templateUrl: "templates/directives/flnInputDob.html",
    controller: "FormCtrl as form"
  };
}
