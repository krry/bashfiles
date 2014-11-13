describe('Unit: PlanCtrl', function() {
  // Load the module with MainController
  beforeEach(module('flannel.controllers'));

  var ctrl, scope, rootScope, timeout, featureOptionService, olService, mapService, panelFillService, apiService;
  // inject the $controller and $rootScope services
  // in the beforeEach block
  beforeEach(inject(function($controller, $rootScope, $timeout) {
    // Create a new rootScope?  Seems like a good idea since we use the rootscope in the controller.
    rootScope = $rootScope.$new();
    // Create a new scope that's a child of the $rootScope
    scope = rootScope.$new();

    // Create a few mocks
    featureOptionService = {
      detailConstructor: function(data) {
        featureOptionService.detailConstructorCalledWith = data;
        return 'detailConstructor';
      }
    };
    olService = {mount: null};
    // mapService = MapService;
    // panelFillService = PanelFillService;
    // apiService = ApiService;

    // Create the controller
    ctrl = $controller('PlanCtrl', {
      $scope: scope,
      $rootScope: rootScope,
      $timeout: timeout,
      FeatureOptionService: featureOptionService,
      OlService: olService,
      MapService: mapService,
      PanelFillService: panelFillService,
      ApiService: apiService
    });

    empty_feature = {
      get: function() {},
      set: function() {},
      getGeometryName: function() {return 'getGeometryName';}
    };
  }));

  it("call FeatureOptionService with it's geometry name if passed an empty feature",
    function() {
      expect(JSON.stringify(ctrl.getOrMakeFeatureAttrs(empty_feature))).toEqual(JSON.stringify({}));
      expect(featureOptionService.detailConstructorCalledWith).toEqual('getGeometryName')
  });
})
