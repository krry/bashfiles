// home.js stage
angular.module('stages.home',[]).config( function ($stateProvider) {

  // paths for this state
  var stageName = 'home';
  // TODO: make these paths central and DRYer for all stages, changing based on stageName
  var templateUrl = "templates/";
  var stageUrl = templateUrl + "stages/" + stageName + '/';

  // state definition
  $stateProvider.state("home", {
    url: "/home",
    views: {
      'header@': {
        templateUrl: templateUrl + 'header-short.html',
        controller:  'HeaderCtrl as head',
      },
      'main@': {
        resolve: {},
        templateUrl: stageUrl + "main.html",
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
;});
