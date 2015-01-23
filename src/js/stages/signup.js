angular.module('signup', []).config(["$stateProvider", function ($stateProvider) {

  // paths for this stage
  var stageName = 'signup';
  // TODO: make these paths central and DRYer for all stages, changing based on stageName
  var templateUrl = "templates/";
  var stageUrl = templateUrl + "stages/" + stageName + '/';

  $stateProvider.state('signup', {
    url: "/signup",
    views: {
      'main@': {
        templateUrl: stageUrl + "main.html",
      },
      'header@': {
        templateUrl: templateUrl + 'header.html',
        controller: 'HeaderCtrl as header',
      },
      'footer@': {
        templateUrl: templateUrl + 'footer.html',
        controller: 'FooterCtrl as footer',
      },
    }
  })
;}]);
