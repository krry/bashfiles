angular.module('configure',[]).config(["$stateProvider", function ($stateProvider) {
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
        controller:  function ($scope, Clientstream) {
          Clientstream.listen('area collection count', function (data) {
            $scope.traced = data;
            data && $scope.$apply();
          })
        },
      },
      // modify the new named views @ configure
      'map@flannel.configure': {
        // templateUrl: stageUrl + "map.html",
        // controller:  "OlMapCtrl as omap",
        templateUrl: 'templates/stages/configure/test.html'
      },
    },
  })
;}]);
