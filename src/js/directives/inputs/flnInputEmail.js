directives.directive('flnInputEmail', [flnInputEmail_]);

function flnInputEmail_ () {
  return {
    scope: {
      hint: "@"
    },
    restrict: "E",
    templateUrl: "templates/directives/inputs/flnInputEmail.html",
    controller: "FormCtrl as form",
  };
}
