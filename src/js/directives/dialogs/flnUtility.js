directives.directive('flnUtility', ['Clientstream', flnUtility_]);

function flnUtility_ (Client) {
  return {
    templateUrl: 'templates/directives/dialogs/flnUtility.html',
    require: '^flnModal',
    controller: ['$scope', function ($scope) {
      $scope.selectUtility = function(utility) {
        $scope.utility = utility;
      };

      $scope.isSelected = function(utility) {
        return $scope.utility.UtilityId === utility.UtilityId;
      };

      $scope.continue = function() {
        Client.emit('Modal: close', true);
        Client.emit('Form: save utility', $scope.utility.UtilityId);
      };
    }]
  };
}
