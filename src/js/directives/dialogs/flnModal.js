directives.directive('flnModal', [flnModal_]);

function flnModal_ () {
  return {
    templateUrl: 'templates/directives/dialogs/flnModal.html',
    controller: 'ModalCtrl',
    controllerAs: 'modal',
  };
}
