directives.directive('flnContinueDesign', ['Clientstream', flnContinueDesign]);

function flnContinueDesign (Client) {
  return {
    templateUrl: 'templates/directives/flnContinueDesign.html',
    controller: function resumeSessionModalLink ($scope) {
      $scope.restart = function() {
        Client.emit('flnContinueDesign: result', 'restart');
      }
      $scope.resume = function() {
        Client.emit('flnContinueDesign: result', 'resume');
      }
    },
  };
}
