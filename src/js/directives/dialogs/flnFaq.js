directives.directive('flnFaq', flnFaq);

function flnFaq () {
  return {
    templateUrl: 'templates/directives/dialogs/flnFaq.html',
    require: '^flnModal',
    controllerAs: 'modal',
  };
}
