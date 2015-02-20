directives.directive('flnInputEmail', [flnInputEmail_]);

function flnInputEmail_ () {
  return {
    scope: {
      hint: "@"
    },
    restrict: "E",
    controller: "FormCtrl as form",
    templateUrl: "templates/directives/inputs/flnInputEmail.html",
  };
}
