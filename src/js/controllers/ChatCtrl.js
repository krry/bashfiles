/* ==================================================
  ChatCtrl
  the chat controller
================================================== */

controllers.controller('ChatCtrl', ['$scope', 'Form', ChatCtrl_]);

function ChatCtrl_($scope, Form) {
  var vm = this;

  vm.shown = true;
  vm.open = openChat;
  vm.close = closeChat;

  $scope.prospect = Form.prospect();

  function openChat() {
    console.log('modal opening because shown is: ', vm.shown);
    vm.shown = true;
  }

  function closeChat() {
    console.log('modal closing because shown is: ', vm.shown);
    vm.shown = false;
  }
}
