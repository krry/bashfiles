directives.directive('flnInputState', ["Form", flnInputState_]);

function flnInputState_ (Form) {
  return {
    scope: {
      hint: "@"
    },
    restrict: "E",
    templateUrl: "templates/directives/inputs/flnInputState.html",
    controller: "FormCtrl as form",
  };
}
