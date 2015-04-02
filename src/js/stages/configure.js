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
        controller:  function ($scope, Layers) {
          Layers.rx_drawcount.subscribe(function (x) {
              // TODO: ensure that this boolean gets set on reload so users don't get stuck on trace step
              $scope.traced = x
              $scope.$apply();
          })
        },
      },
      // modify the new named views @ configure
      'map@flannel.configure': {
        templateUrl: 'templates/stages/configure/map.html'
      },
    },
  })
;}]);
