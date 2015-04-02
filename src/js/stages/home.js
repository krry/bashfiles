angular.module('home', []).config(["$stateProvider", function ($stateProvider) {

  // paths for this state
  var stageName = 'home';
  // TODO: make these paths central and DRYer for all stages, changing based on stageName
  var templateUrl = "templates/";
  var stageUrl = templateUrl + "stages/" + stageName + '/';
  // state definition
  $stateProvider.state("flannel.home", {
    url: "^/my-home",
    views: {
      'main@': {
        templateUrl: stageUrl + "main.html",
        controller:  function () {

        },
      },
      'overlay@flannel.home': {
        templateUrl: stageUrl + "overlay.html",
      },
      'underlay@flannel.home': {
        templateUrl: stageUrl + "underlay.html",
      },
    },
  })
;}]);
