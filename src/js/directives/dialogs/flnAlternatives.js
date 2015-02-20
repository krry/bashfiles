directives.directive('flnAlternatives', flnAlternatives);

function flnAlternatives () {
  return {
    templateUrl: 'templates/directives/dialogs/flnAlternatives.html',
    controller: 'ModalCtrl',
    controllerAs: 'modal',
  };
}
