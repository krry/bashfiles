directives.directive('flnShowGoogleMap', flnShowGoogleMap_);

function flnShowGoogleMap_ () {
  return {

    controller: function($scope, $element, $attrs){
      // debugger;
      console.log("$element");
      console.log($element);
      $scope.mapShown = true;

      $element.on("$destroy", function(){
        console.log($scope.mapShown);
        $scope.mapShown = false;
      });
    },
  };
}
