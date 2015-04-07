directives.directive('flnModal', [flnModal_]);

function flnModal_ () {
  return {
    templateUrl: 'templates/directives/dialogs/flnModal.html',
    controller: 'ModalCtrl',
    controllerAs: 'modal',
    link: function (scope, element, attrs, modal) {
      element.bind('click', function(event) {
        if (!$(event.srcElement).parents().hasClass('dialog')) {
          console.log("modal is:", modal.isOn());
          modal.close();
        }
      });
    }
  };
}
