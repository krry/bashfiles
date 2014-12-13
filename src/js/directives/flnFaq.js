directives.directive('flnFaq', flnFaq);

function flnFaq () {
  return {
    templateUrl: 'templates/directives/flnFaq.html',
    controller: 'ModalCtrl',
    controllerAs: 'modal',
  };
}
