directives.directive('flnBattery', ['Clientstream', flnBattery_]);

function flnBattery_ (Client) {
  return {
    templateUrl: 'templates/directives/dialogs/flnBattery.html',
    require: '^flnModal',
    controller: ['$scope', function($scope) {
      $scope.confirm = function() {
        Client.emit('Schedule: confirm battery lead', true);
      };
    }]
  };
}
