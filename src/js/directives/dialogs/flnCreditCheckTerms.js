directives.directive('flnCreditCheckTerms', [flnCreditCheckTerms_]);

function flnCreditCheckTerms_ () {
  return {
    templateUrl: 'templates/directives/dialogs/flnCreditCheckTerms.html',
    require: '^flnModal',
  };
}
