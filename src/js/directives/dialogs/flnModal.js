directives.directive('flnModal', flnModal);

function flnModal () {
  return {
    templateUrl: 'templates/directives/dialogs/flnModal.html',
    controller: 'ModalCtrl',
    controllerAs: 'modal',
  };
}
