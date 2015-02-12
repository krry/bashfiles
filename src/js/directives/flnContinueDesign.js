directives.directive('flnContinueDesign', ['Clientstream', flnContinueDesign]);

function flnContinueDesign (Client) {
  return {
    templateUrl: 'templates/directives/flnContinueDesign.html',
    controller: function continueDesignCtrl ($scope) {
      $scope.restart = function() {
        Client.emit('Modal: continue design? result', 'restart');
      }
      $scope.resume = function() {
        Client.emit('Modal: continue design? result', 'resume');
      }
    },
  };
}
