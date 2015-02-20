directives.directive('flnFaq', flnFaq);

function flnFaq () {
  return {
    templateUrl: 'templates/directives/dialogs/flnFaq.html',
    controller: 'ModalCtrl',
    controllerAs: 'modal',
  };
}
