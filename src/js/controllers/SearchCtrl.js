function SearchCtrl_($scope, $state, MapService, OlService) {
  var omap = MapService.getOmap();
  if (omap !== null) {
    OlService.clearAllMapFeatures(omap);
  }

  $scope.mapCreated = function(map) {
    $scope.map = map;
  };

  this.saveMapToDataUrl = function() {
    var map = MapService.getGmap(); //HACK: pop panel to cause canvas to update
                                    //      results in refresh detected by HTML2Canvas plugin
    map.controls[google.maps.ControlPosition.TOP_LEFT].pop();

    MapService.setStatic().then(function(data) {
      $scope.mapStatic = data;
      $state.go('plan.type');
      
    });
  }; 
}

controllers.controller('SearchCtrl', SearchCtrl_);
