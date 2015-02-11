angular.module('home',[]).config(["$stateProvider", function ($stateProvider) {

  // paths for this state
  var stageName = 'home';
  // TODO: make these paths central and DRYer for all stages, changing based on stageName
  var templateUrl = "templates/";
  var stageUrl = templateUrl + "stages/" + stageName + '/';

  // state definition
  $stateProvider.state("home", {
    url: "^",
    views: {
      'header@': {
        templateUrl: templateUrl + 'header.html',
        controller:  'NavCtrl as nav',
      },
      'main@': {
        templateUrl: stageUrl + "main.html",
        controller:  function ($timeout, Clientstream) {
          // HACK: enable quick routing through app
          $timeout(function(){
            Clientstream.emit('stage', {stage: 0, step: 0});
          }, 1)
        },
      },
      'overlay@home': {
        templateUrl: stageUrl + "overlay.html",
      },
      'underlay@home': {
        templateUrl: stageUrl + "underlay.html",
      },
      'footer@': {
        templateUrl: templateUrl + 'footer.html',
      },
    },
  })
;}]);
