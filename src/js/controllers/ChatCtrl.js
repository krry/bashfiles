/* ==================================================
  ChatCtrl
  the chat controller
================================================== */

controllers.controller("ChatCtrl", [ChatCtrl_]);

function ChatCtrl_() {
  var vm = this;

  vm.shown = false;
  vm.open = open;
  vm.close = close;

  function open() {
    console.log('modal opening because shown is: ', vm.shown);
    vm.shown = true;
  }

  function close() {
    console.log('modal closing because shown is: ', vm.shown);
    vm.shown = false;
  }
}
