angular.module('configure', []).config(["$stateProvider", function ($stateProvider) {
  // specifics for for this state
  var stageName = 'configure';
  // TODO: make these paths central and DRYer for all stages, changing based on stageName
  var templateUrl = "templates/";
  var stageUrl = templateUrl + "stages/" + stageName + '/';



  $stateProvider.state("flannel.configure", {
    url: "^/configure",
    views: {
      // replace the main ui-view @ index
      'main@': {
        templateUrl: stageUrl + "main.html",
        controller:  ['$scope', 'Layers', function ($scope, Layers) {
          Layers.rx_drawcount.subscribe(function (x) {
            // allow the user to progress to next step
            $scope.traced = x
            if (!$scope.$$phase) $scope.$apply();
          });
        }],
      },
      // modify the new named views @ configure
      'map@flannel.configure': {
        templateUrl: 'templates/stages/configure/map.html'
      },
    },
  })
;}]);
