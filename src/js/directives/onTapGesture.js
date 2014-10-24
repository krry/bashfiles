function onTapGesture_($ionicGesture) {
  return {
    restrict: 'A',
    
    link: function($scope, $element, $attr) {
      $ionicGesture.on('tap', function(e) {
        $scope.$eval($attr.onTapGesture);
      }, $element);  
    }
  };
}

directives.directive('onTapGesture', onTapGesture_);