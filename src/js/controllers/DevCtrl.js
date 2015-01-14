/* ==================================================
  DevCtrl
  the dev tools controller
================================================== */

controllers.controller("DevCtrl", ["$scope", DevCtrl_]);

function DevCtrl_($scope) {
  var vm = this;

  vm.toggleUserObject = toggleUserObject;
  vm.toggleDevPanel = toggleDevPanel;
  vm.userShown = true;
  vm.userShownTriggerText = "hide";
  vm.panelShown = false;
  vm.panelShownTriggerText = "show dev tools";

  // TODO: register a dev tools service so directives outside the dev panel can interact with it. see the ModalService and ModalCtrl

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
