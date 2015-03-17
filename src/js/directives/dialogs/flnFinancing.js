directives.directive('flnFinancing', flnFinancing);

function flnFinancing () {
  return {
    templateUrl: 'templates/directives/dialogs/flnFinancing.html',
    require: '^flnModal',
    controllerAs: 'modal',
  };
}
