directives.directive('flnModal', flnModal);

function flnModal () {
  return {
    templateUrl: 'templates/directives/flnModal.html',
    controller: 'ModalCtrl',
    controllerAs: 'modal',
    link: function ModalLink(scope, element, attr, ctrl) {
      $('.modal-trigger').on('click', function(){
        debugger;
        if (ctrl.isOn()) {
          console.log('stopping body scroll');
          $('body').css('overflow', 'hidden');
        } else {
          console.log('reallowing body scroll');
          $('body').css('overflow', 'scroll');
        }
      });
    }
  };
}
