directives.directive('flnModal', flnModal);

function flnModal () {
  return {
    templateUrl: 'templates/directives/flnModal.html',
    controller: 'ModalCtrl',
    controllerAs: 'modal',
  };
}
