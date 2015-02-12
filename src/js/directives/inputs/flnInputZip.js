directives.directive('flnInputZip', [flnInputZip_]);

function flnInputZip_ () {
  return {
    scope: {
      hint: "@"
    },
    restrict: "E",
    templateUrl: "templates/directives/inputs/flnInputZip.html",
    controller: "FormCtrl as form",
  };
}
