/* ==================================================
  DevCtrl
  the form controller
================================================== */

controllers.controller("DevCtrl", [DevCtrl_]);

function DevCtrl_() {
  var vm = this;

  vm.toggleUserObject = toggleUserObject;
  vm.userShown = false;
  vm.userShownTriggerText = "show";

  function toggleUserObject() {
    vm.userShown = !vm.userShown;
    vm.userShownTriggerText = (vm.userShown) ? "hide" : "show"
  }
}
