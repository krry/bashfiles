directives.directive('flnForm', [flnForm_]);

function flnForm_ () {
  return {
    restrict: "A",
    controller: 'FormCtrl',
    controllerAs: 'form',
  };
}
