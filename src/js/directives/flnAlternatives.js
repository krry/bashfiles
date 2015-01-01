directives.directive('flnAlternatives', flnAlternatives);

function flnAlternatives () {
  return {
    templateUrl: 'templates/directives/flnAlternatives.html',
    controller: 'ModalCtrl',
    controllerAs: 'modal',
  };
}
