directives.directive('flnInputDob', [flnInputDob_]);

function flnInputDob_ () {
  return {
    scope: {
      hint: "@"
    },
    restrict: "E",
    templateUrl: "templates/directives/inputs/flnInputDob.html",
  };
}
