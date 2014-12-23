/* ==================================================
  ModalCtrl
  the modal controller
================================================== */

controllers.controller("ModalCtrl", ["ModalService", ModalCtrl_]);

function ModalCtrl_(ModalService) {

  var vm = this;

  vm.isOn        = ModalService.get;
  vm.dialogShown = ModalService.dialogShown;
  vm.open        = open;
  vm.close       = close;
  vm.toggle      = toggle;
  vm.showDialog  = showDialog;

  // turn modal state on
  function open() {
    ModalService.set(true);
  }

  // turn modal state off
  function close() {
    ModalService.set(false);
  }

  // switch modal state on and off
  function toggle() {
    var shown = ModalService.get();
    ModalService.set(!shown);
  }

  // select which dialog displays in the modal state
  function showDialog(name) {
    ModalService.set(true);
    ModalService.activate(name);
    console.log('body is:', $('body'), 'and dialog name is:', name);
  }
}
