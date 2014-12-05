directives.directive('flnShowGoogleMap',flnShowGoogleMap_);

function flnShowGoogleMap_ () {
  return {
    scope: {
      shown: "=flnShowGoogleMap",
    },
    controller: function controller ($scope, $element, $attrs){
      $scope.$parent.toggleMap();
    },
    // link: function(scope, element, attrs){
    //   // scope.$apply();
    //   element.on("$destroy", function(){
    //     console.log("destroying on flnShowGoogleMap ");
    //     scope.shown = !scope.shown;
    //     // console.log('mapShown is:', $scope.mapShown);
    //   });
    // }
  };
}
