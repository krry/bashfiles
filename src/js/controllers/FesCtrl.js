/* ==================================================
  FesCtrl
  the FES badge controller
================================================== */

controllers.controller("FesCtrl", ["Clientstream", "Salesforce", FesCtrl_]);

function FesCtrl_(Client, Salesforce) {
  var vm = this;

  if (Salesforce.session) {
    Salesforce.getIdentity(Salesforce.session).then(function(data) {
      Client.emit('Salesforce: verified identity', true);
      vm.text = data.display_name;
    }, function() {
      Client.emit('Modal: show dialog', { dialog: 'salesforce-login' });
    });
  }
}
