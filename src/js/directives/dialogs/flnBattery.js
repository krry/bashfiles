directives.directive('flnBattery', ['Clientstream', flnBattery_]);

function flnBattery_ () {
  return {
    templateUrl: 'templates/directives/dialogs/flnBattery.html',
    require: '^flnModal'
  };
}
