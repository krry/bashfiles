/* ==================================================
  OdaCtrl
  the ODA tools controller
================================================== */

controllers.controller("OdaCtrl", ["$scope", "Clientstream", "Form", OdaCtrl_]);

function OdaCtrl_($scope, Client, Form) {
  var vm = this;
  vm.prospect = Form.prospect;
  Client.listen('Form: Loaded', subscribeForm);

  vm.jumpToConfigurator = function jumpToConfigurator () {
    Client.emit('Stages: jump to stage', 'configure');
  }

  vm.jumpToProposal = function jumpToProposal () {
    Client.emit('Stages: jump to stage', 'proposal');
  }

  function subscribeForm (form_obj) {
    // subscribing to form
    // vm.prospect = form_obj;
    Form.form_stream()
    .select(function(x) { return x.exportVal(); })
    .subscribe(streamSubscription);
  }

  function streamSubscription (form_obj) {
    // subscription made
    var key, keys, val;
    if (form_obj === null) return; // will be null if no data on firebase
    keys = Object.keys(form_obj);  // HACK: this may fail in different js interpreters... #readabookbrah
    if (!angular.equals(form_obj, vm.prospect())) { // firebase different from local
      for (var i = 0; i < keys.length; i++) {
        key = keys[i];
        val = form_obj[key];
        // vm.prospect()[key] = val;
      }
      setTimeout(function() {
        $scope.$apply(); // update the views
      }, 0);
      console.log('prospect is:', vm.prospect());
    }
  }
}
