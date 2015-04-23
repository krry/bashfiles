directives.directive('flnModal', [flnModal_]);

function flnModal_ () {
  return {
    templateUrl: 'templates/directives/dialogs/flnModal.html',
    controller: 'ModalCtrl',
    controllerAs: 'modal',
    link: function (scope, element, attrs, modal) {
      $(element).on('mouseup', function(event) {
        if (!$(event.target).parents().hasClass('dialog') && !$(event.target).hasClass('dialog')) {
          event.stopPropagation();
          modal.close();
        }
      });
      $(element).on('touchend', function(event) {
        if (!$(event.target).parents().hasClass('dialog') && !$(event.target).hasClass('dialog')) {
          event.stopPropagation();
          modal.close();
        }
      });
    }
  };
}
