directives.directive('flnInputZip', ["Form", flnInputZip_]);

function flnInputZip_ (Form) {
  return {
    restrict: "E",
    replace: true,
    templateUrl: "templates/directives/flnInputZip.html",
    controller: "FormCtrl as form"
  };
}
