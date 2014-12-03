// describe('Unit: SearchCtrl', function() {
//   // Load the module with MainController
//   beforeEach(module('flannel.controllers'));

//   var ctrl, scope, state, mapService, olService
//   // inject the $controller and $rootScope services
//   // in the beforeEach block
//   beforeEach(inject(function($controller, $rootScope) {
//     // Create a new scope that's a child of the $rootScope
//     scope = $rootScope.$new();

//     // Create a few mocks
//     featureOptionService = {
//       detailConstructor: function(data) {
//         featureOptionService.detailConstructorCalledWith = data;
//         return 'detailConstructor';
//       }
//     };
//     // $scope, $state, MapService
//     mapService = {
//       getOmap: function() {return null;}
//     };
//     // mapService = MapService;
//     // panelFillService = PanelFillService;
//     // apiService = ApiService;
//     // Create the controller
//     ctrl = $controller('SearchCtrl', {
//       $scope: scope,
//       $state: state,
//       MapService: mapService,
//       OlService: olService
//     });

//   }));

//   it("scope.mapCreated should set the scope map",
//     function() {
//       var arg = 'foo';
//       // scope.mapCreated(arg);
//       expect(arg).toEqual('foo');
//   });
// })
