directives.directive('flnForm', flnForm);

function flnForm () {
  return {
    restrict: "A",
    controller: 'FormCtrl',
    controllerAs: 'form',
  };
}
