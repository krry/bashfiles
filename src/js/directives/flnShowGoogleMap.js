directives.directive('flnShowGoogleMap', flnShowGoogleMap_);

function flnShowGoogleMap_ () {
  return {

    controller: function($scope, $element, $attrs){
      // debugger;
      $scope.mapShown = !$scope.mapShown;
      console.log("turning on flnShowGoogleMap ");
      console.log($element);
      // $scope.mapShown = true;
      console.log($scope.mapShown);

      $element.on("$destroy", function(){
        console.log("destroying on flnShowGoogleMap ");
        console.log($scope.mapShown);
        // $scope.mapShown = false;
        $scope.mapShown = !$scope.mapShown;
      });
    },
  };
}
