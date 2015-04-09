/* ==================================================
  DevCtrl
  the dev tools controller
================================================== */

controllers.controller("DevCtrl", ["$scope", "Clientstream", "Form",  "Session", DevCtrl_]);

function DevCtrl_($scope, Client, Form,  Session) {
  var vm = this;
  vm.prospect = Form.prospect;
  vm.design_obj = {};
  Client.listen('Form: Loaded', subscribeForm);

  // Client.listen('Session: Loaded', subscribeSession);
  Client.listen('Design: Loaded', subscribeDesign);
  function subscribeDesign(data) {
    vm.design_obj.design_id = data.design_id;
    vm.design_obj.oda_link = 'http://localhost:8100/#/oda/'+data.design_id;
    vm.design_obj.zoom_level = data.streams.zoom.subscribe(function(zoom_val) {})
    vm.design_obj.center = data.streams.center.subscribe(function(center_val) {})
    vm.design_obj.areas = data.streams.areas.subscribe(function(center_val) {})
  }

  vm.resetForm = function resetForm () {
    Client.emit('Dev: Reset form');
  }

  vm.reloadApp = function reloadApp () {
    Client.emit('Dev: Reset form');
    location.hash = 'my-home';
    location.reload(true);
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
      }
      setTimeout(function() {
        if (!$scope.$$phase) $scope.$apply(); // update the views
        // console.log('prospect is:', vm.prospect());
      }, 0);
    }
  }
}
