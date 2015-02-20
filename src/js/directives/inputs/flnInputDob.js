directives.directive('flnInputDob', [flnInputDob_]);

function flnInputDob_ () {
  return {
    scope: {
      hint: "@"
    },
    restrict: "E",
    controller: "FormCtrl as form",
    templateUrl: "templates/directives/inputs/flnInputDob.html",
  };
}
