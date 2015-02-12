directives.directive('flnContinueDesign', flnContinueDesign);

function flnContinueDesign () {
  return {
    templateUrl: 'templates/directives/dialogs/flnContinueDesign.html',
    controller: 'ModalCtrl',
    controllerAs: 'modal',
  };
}
