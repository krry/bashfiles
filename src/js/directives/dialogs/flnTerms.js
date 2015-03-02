directives.directive('flnTerms', flnTerms);

function flnTerms () {
  return {
    templateUrl: 'templates/directives/dialogs/flnTerms.html',
    controller: 'ModalCtrl',
    controllerAs: 'modal',
  };
}
