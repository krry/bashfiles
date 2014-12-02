directives.directive('flnShowGoogleMap',flnShowGoogleMap_);

function flnShowGoogleMap_ () {
  return {

    controller: function($scope, $element, $attrs){
      // debugger;
      console.log("turning on flnShowGoogleMap ");
      debugger;
      console.log('before flnShowGoogleMap switch: mapShown is:', $scope.mapShown);
      $scope.mapShown = !$scope.mapShown;
      console.log('after flnShowGoogleMap switch: mapShown is:', $scope.mapShown);

      $element.on("$destroy", function(){
        console.log("destroying on flnShowGoogleMap ");
        $scope.mapShown = !$scope.mapShown;
        console.log('mapShown is:', $scope.mapShown);
      });
    },
  };
}
