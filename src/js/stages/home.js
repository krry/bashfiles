// home.js stage
angular.module('stage.home',[]).config( function ($stateProvider) {
  
  // paths for this state
  var stageName = 'home';
  // TODO: make these paths central and DRYer for all stages, changing based on stageName
  var templateUrl = $stateProvider.templateUrl;
  var stageUrl = $stateProvider.stageTemplateUrl + stageName + '/';
  
  // state definition
  $stateProvider.state("home", {
    url: "/home",
    views: {
      'header@': {
        templateUrl: templateUrl + 'header.html',
        controller:  'HeaderCtrl as head',
      },
      'main@': {
        templateUrl: stageUrl + "main.html",
      },
      'overlay@home': {
        templateUrl: stageUrl + "overlay.html",
        controller:  "",
      },
      'underlay@home': {
        templateUrl: stageUrl + "underlay.html",
        controller:  "",
      },
      'footer@': {
        templateUrl: templateUrl + 'footer.html',
      },
    },
  })
;});
