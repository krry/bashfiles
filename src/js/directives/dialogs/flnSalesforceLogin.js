directives.directive('flnSalesforceLogin', [flnSalesforceLogin_]);

function flnSalesforceLogin_ () {
  return {
    templateUrl: 'templates/directives/dialogs/flnSalesforceLogin.html',
    require: '^flnModal',
  };
}
