directives.directive('flnContinueDesign', ['Clientstream', flnContinueDesign]);

function flnContinueDesign (Client) {
  return {
    templateUrl: 'templates/directives/dialogs/flnContinueDesign.html',
    controller: ['$scope', function continueDesignCtrl ($scope) {
      $scope.restart = function() {
        console.log('fln-continue-design is there');
        Client.emit('Modal: continue design? result', 'restart');
      }
      $scope.resume = function() {
        Client.emit('Modal: continue design? result', 'resume');
      }
    }],
  };
}
