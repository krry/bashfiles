/* ==================================================
  DevCtrl
  the dev tools controller
================================================== */

controllers.controller("DevCtrl", ["$scope", "Clientstream", "Form", DevCtrl_]);

function DevCtrl_($scope, Client, Form) {
  var vm = this;
  Client.listen('Form: Loaded', subscribeForm);

  function subscribeForm (form_obj) {
    vm.prospect = form_obj;
    Form.form_stream()
    .select(function(x) { return x.exportVal(); })
    .subscribe(streamSubscription);
  }

  function streamSubscription (form_obj) {
    var key, keys, val;
    if (form_obj === null) return; // will be null if no data on firebase
    keys = Object.keys(form_obj);  // HACK: this may fail in different js interpretters... #readabookbrah
    if (!angular.equals(form_obj, vm.prospect)) { // firebase different from local
      for (var i = 0; i < keys.length; i++) {
        key = keys[i];
        val = form_obj[key];
        vm.prospect[key] = val;
      }
      $scope.$apply(); // update the views
    }
  }
}
