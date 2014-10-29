angular.module('steps.configure',[]).config( function ($stateProvider) {
  
  // specifics for for this state
  var stateName = 'configure';
  var templateUrl = 'templates/';
  var stepsUrl = 'stages/';
  var baseUrl = templateUrl + stepsUrl + stateName + '/';

  $stateProvider.state("configure", {
    url: "/configure",
    views: {
      'header@': {
        templateUrl: 'templates/header.html',
        controller:  'HeaderCtrl as head',
      },
      'main@': {
        templateUrl: baseUrl + "main.html",
      },
      'footer@': {
        templateUrl: templateUrl + "footer.html",
        controller:  "",
      },
      'map@configure': {
        templateUrl: baseUrl + "map.html",
        controller:  "",
      },
      'instructions@configure': {
        templateUrl: baseUrl + "instructions.html",
        controller:  "",
      },
    },
  })
  // .state("configure.initial", {
  //   url: '/configure',
  //   views: {
  //   },
  // })
;});
