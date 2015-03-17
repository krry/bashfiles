directives.directive('flnInputState', [flnInputState_]);

function flnInputState_ () {
  return {
    restrict: "E",
    templateUrl: "templates/directives/inputs/flnInputState.html",
    require: '^flnForm',
  };
}
