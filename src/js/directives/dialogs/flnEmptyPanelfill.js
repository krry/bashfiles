directives.directive('flnEmptyPanelfill', ['Clientstream', flnEmptyPanelfill]);

function flnEmptyPanelfill (Client) {
  return {
    templateUrl: 'templates/directives/dialogs/flnEmptyPanelfill.html',
    controller: ['$scope', function continueDesignCtrl ($scope) {
      $scope.restartDesign = function() {
        Client.emit('Modal: empty panelfill', 'restart design');
      }
      $scope.skipDesign = function() {
        Client.emit('Modal: empty panelfill', 'skip design');
      }
    }],
  };
}
