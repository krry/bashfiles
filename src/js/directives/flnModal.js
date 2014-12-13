directives.directive('flnModal', flnModal);

function flnModal () {
  return {
    template: '',
    templateUrl: 'templates/directives/flnModal.html',
    controller: 'ModalCtrl',
    controllerAs: 'modal',
  };
}
