directives.directive('flnInputZip', ["Clientstream", flnInputZip_]);

function flnInputZip_ (Client) {
  return {
    scope: {
      hint: "@"
    },
    restrict: "E",
    templateUrl: "templates/directives/inputs/flnInputZip.html",
    controller: "FormCtrl as form",
  };
}
