directives.directive('flnFaq', [flnFaq_]);

function flnFaq_ () {
  return {
    templateUrl: 'templates/directives/dialogs/flnFaq.html',
    require: '^flnModal',
    controllerAs: 'modal',
  };
}
