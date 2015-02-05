angular.module('configure',[]).config(["$stateProvider", function ($stateProvider) {
  // specifics for for this state
  var stageName = 'configure';
  // TODO: make these paths central and DRYer for all stages, changing based on stageName
  var templateUrl = "templates/";
  var stageUrl = templateUrl + "stages/" + stageName + '/';

  $stateProvider.state("configure", {
    url: "/configure",
    views: {
      // replace the main ui-view @ index
      'main@': {
        templateUrl: stageUrl + "main.html",
        controller:  function ($timeout, Clientstream) {
          // HACK: enable quick routing through app
          $timeout(function(){
            Clientstream.emit('stage', {stage: 1, step: 0});
          }, 1)
          Clientstream.listen('drawing closed', function (data) {
            $scope.traced = data;
          })
        },
      },
      // modify the new named views @ configure
      'map@configure': {
        templateUrl: stageUrl + "map.html",
        controller:  "OlMapCtrl as omap",
      },
      // below here, still the same target as index,
      'header@': {
        templateUrl: templateUrl + 'header.html',
        controller:  "NavCtrl as nav",
      },
      'footer@': {
        templateUrl: templateUrl + "footer.html",
        controller:  "FooterCtrl as footer",
      },
    },
  })
;}]);
