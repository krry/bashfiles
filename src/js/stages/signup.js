// signup.js - the final stage
angular.module('stages.signup', []).config( function ($stateProvider){

  // paths for this stage
  var stageName = 'signup';
  // TODO: make these paths central and DRYer for all stages, changing based on stageName
  var templateUrl = "templates/";
  var stageUrl = templateUrl + "/stages/" + stageName + '/';

  $stateProvider.state('signup', {
    url: "/signup",
    views: {
      'dev@': {
        templateUrl: templateUrl + 'dev.html',
        controller:  'DevCtrl as dev',
      },
      'header@': {
        templateUrl: templateUrl + 'header.html',
        controller: 'HeaderCtrl as header',
      },
      'main@': {
        templateUrl: stageUrl + "main.html",
      },
      'footer@': {
        templateUrl: templateUrl + 'footer.html',
        controller: 'FooterCtrl as footer',
      },
    }
  })
;});
