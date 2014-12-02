directives.directive('flnShowGoogleMap', flnShowGoogleMap_);

function flnShowGoogleMap_ () {
  return {

    controller: function($scope, $element, $attrs){
      // debugger;
      console.log("turning on flnShowGoogleMap ");
      $scope.mapShown = !$scope.mapShown;
      console.log('mapShown is:', $scope.mapShown);

      $element.on("$destroy", function(){
        console.log("destroying on flnShowGoogleMap ");
        $scope.mapShown = !$scope.mapShown;
        console.log('mapShown is:', $scope.mapShown);
      });
    },
  };
}
