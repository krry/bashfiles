directives.directive('flnContinueDesign', flnContinueDesign);

function flnContinueDesign () {
  return {
    templateUrl: 'templates/directives/flnContinueDesign.html',
    controller: 'ModalCtrl',
    controllerAs: 'modal',
  };
}
