function PlanCtrl_($scope, $rootScope, $timeout, FeatureOptionService, OlService, MapService, PanelFillService, ApiService) {
  var vm = this;
  vm.featureAttrs = {};

  $scope.$watch(function(){return vm.focus;}, function(feature){
    $scope.focus = feature;
    if (feature && feature.getGeometryName() === "obstruction") {
      vm.radius = feature.get('radius');
    }else if (feature && feature.getGeometryName() === "mount") {
      vm.pitch = feature.get('pitch');
    }
  });

  vm.toggleDetailView = function(feature) {
    if (!feature) {
      alert('no feature selected');
      return;
    }

    vm.feature = feature ;
    vm.featureAttrs = vm.getOrMakeFeatureAttrs(feature);

    $scope.detailpanelwidth = feature.getGeometryName() !== 'obstruction' ? 
      275 : 50;
      
    $scope.$apply();
  };

  vm.toggleHelpView = function (e, args) {
    // used to open left menu
  };

  var layers = {};
  layers.mount = OlService.mounts;
  layers.obstruction = OlService.obstructions;
  
  vm.getOrMakeFeatureAttrs = function (feature) {
    var edl = feature.get('edl');

    if (edl === undefined) {
      edl = new FeatureOptionService.detailConstructor(feature.getGeometryName());
      feature.set('edl', edl);
      return edl;
    }
    return feature.get('edl');
  };

}
controllers.controller('PlanCtrl',PlanCtrl_);