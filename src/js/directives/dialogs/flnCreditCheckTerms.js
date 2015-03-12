directives.directive('flnCreditCheckTerms', flnCreditCheckTerms);

function flnCreditCheckTerms () {
  return {
    templateUrl: 'templates/directives/dialogs/flnCreditCheckTerms.html',
    require: '^flnModal',
  };
}
