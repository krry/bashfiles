directives.directive('flnAutolocate', flnAutolocate);

function flnAutolocate () {
  return {
    restrict: 'E',
    replace: true,
    templateUrl: 'templates/directives/flnAutolocate.html',
    controller: function ($scope, MapService) {

      $scope.autolocate = autolocate;

      function autolocate(){
        console.log("YES!");
        if (navigator.geolocation) {
          MapService.setGmapShown(true);
          navigator.geolocation.getCurrentPosition(function(position){
            var latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
            MapService.updateGmap(latLng);
          });
        }
      }
    },
  };
}
