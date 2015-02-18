/* ==================================================
  ChatCtrl
  the chat controller
================================================== */

controllers.controller("ChatCtrl", [ChatCtrl_]);

function ChatCtrl_() {
  var vm = this;

  vm.shown = true;
  vm.open = openChat;
  vm.close = closeChat;

  function openChat() {
    console.log('modal opening because shown is: ', vm.shown);
    vm.shown = true;
  }

  function closeChat() {
    console.log('modal closing because shown is: ', vm.shown);
    vm.shown = false;
  }
}
