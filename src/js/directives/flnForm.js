// TODO: deprecate in favor of a global form controller with no directive
angular.module('flnForm', [])
.controller('FormCtrl', ['$scope', function($scope) {
  $scope.user = {};
  $scope.master = {};

  $scope.update = function(user) {
    $scope.master = angular.copy(user);
  };

  $scope.reset = function() {
    $scope.user = angular.copy($scope.master);
  };

  $scope.isUnchanged = function(user) {
    return angular.equals(user, $scope.master);
  };

  $scope.reset();
}]);
