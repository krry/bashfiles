/* ==================================================
  ModalCtrl
  the modal controller
================================================== */

controllers.controller('ModalCtrl', ['$scope', 'Clientstream', 'ModalService', ModalCtrl_]);

function ModalCtrl_($scope, Client, ModalService) {

  var vm = this;

  vm.isOn        = ModalService.get;
  vm.dialogShown = ModalService.dialogShown;
  vm.open        = openModal;
  vm.close       = closeModal;
  vm.toggle      = toggleModal;
  vm.showDialog  = showDialog;

  Client.listen('Modal: show dialog', showDialog);
  Client.listen('Modal: close', closeModal);

  // Showing full page instead of modal when territory is invalid
  // Client.listen('Geocoder: invalid territory', showDialog);

  // turn modal state on
  function openModal() {
    $('body').css('overflow', 'hidden');
    ModalService.set(true);
    if (!$scope.$$phase) $scope.$apply();
  }

  // turn modal state off
  function closeModal() {
    $('body').css('overflow-y', 'scroll');
    ModalService.set(false);
    ModalService.activate('');
    if (!$scope.$$phase) $scope.$apply();
  }

  // switch modal state on and off
  function toggleModal() {
    var shown = ModalService.get();
    if ($('body').css('overflow') === 'hidden') {
      $('body').css('overflow-y', 'scroll');
    } else {
      $('body').css('overflow', 'hidden');
    }
    ModalService.set(!shown);
    if (!$scope.$$phase) $scope.$apply();
  }

  // select which dialog displays in the modal state
  function showDialog(obj) {
    var dialog = obj.dialog;
    if (obj.data) {
      vm.dialogData = obj.data;
    }
    ModalService.set(true);
    ModalService.activate(dialog);
    // console.log('body is:', $('body'), 'and dialog is:', dialog);
    if (!$scope.$$phase) $scope.$apply();
  }
}
