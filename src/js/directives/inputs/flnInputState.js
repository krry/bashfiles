directives.directive('flnInputState', [flnInputState_]);

function flnInputState_ () {
  return {
    scope: {
      hint: "@"
    },
    restrict: "E",
    templateUrl: "templates/directives/inputs/flnInputState.html",
    controller: "FormCtrl as form",
  };
}
