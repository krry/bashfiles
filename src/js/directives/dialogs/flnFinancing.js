directives.directive('flnFinancing', [flnFinancing_]);

function flnFinancing_ () {
  return {
    templateUrl: 'templates/directives/dialogs/flnFinancing.html',
    require: '^flnModal',
    controllerAs: 'modal',
  };
}
