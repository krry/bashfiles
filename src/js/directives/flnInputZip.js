directives.directive('flnInputZip', ["Form", flnInputZip_]);

function flnInputZip_ (Form) {
  return {
    scope: {
      hint: "@"
    },
    restrict: "E",
    templateUrl: "templates/directives/flnInputZip.html",
    controller: "FormCtrl as form"
  };
}
