directives.directive('flnAlternav', ['Clientstream', flnAlternav]);

function flnAlternav (Client) {
  return {
    require: '^flnForm',
    templateUrl: 'templates/directives/widgets/flnAlternav.html',
    link: function (scope, element, attrs, FormCtrl) {
      // wire up "Try another zip" button to restart the form
      $('#restart_button').on('click', function () {
        restart();
      })
      function restart() {
        FormCtrl.invalidTerritory = false;
        console.log('resetting territory and clearing from');
        Client.emit('Stages: restart session', 'true');
        setTimeout (function () {
          Client.emit('Stages: jump to step', 'zip');
        }, 0)
      }
    }
  };
}
