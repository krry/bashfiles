/* ==================================================
  DevCtrl
  the form controller
================================================== */

controllers.controller("DevCtrl", [DevCtrl_]);

function DevCtrl_() {
  var vm = this;

  vm.toggleUserObject = toggleUserObject;
  vm.toggleDevPanel = toggleDevPanel;
  vm.userShown = true;
  vm.userShownTriggerText = "hide";
  vm.panelShown = false;
  vm.panelShownTriggerText = "show dev tools";

  function toggleUserObject() {
    vm.userShown = !vm.userShown;
    vm.userShownTriggerText = (vm.userShown) ? "hide" : "show";
  }

  function toggleDevPanel() {
    vm.panelShown = !vm.panelShown;
    vm.panelShownTriggerText = (vm.panelShown) ? "hide dev tools" : "show dev tools";
    // TODO: wire up esc key to hide dev panel when shown
  }
}
