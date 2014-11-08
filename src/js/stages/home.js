angular.module('stages.home',[]).config( function ($stateProvider) {
  
  // specifics for for this state
  var stageName = 'home';
  var templateUrl = 'templates/';
  var stageUrl = 'templates/stages/' + stageName + '/';

  // state definition
  $stateProvider.state("home", {
    url: "/home",
    views: {
      'header@': {
        templateUrl: 'templates/header.html',
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
        templateUrl: 'templates/footer.html',
      },
    },
  })
;});
