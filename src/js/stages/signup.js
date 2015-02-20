angular.module('signup', []).config(["$stateProvider", function ($stateProvider) {

  // paths for this stage
  var stageName = 'signup';
  // TODO: make these paths central and DRYer for all stages, changing based on stageName
  var templateUrl = "templates/";
  var stageUrl = templateUrl + "stages/" + stageName + '/';

  $stateProvider.state('flannel.signup', {
    url: "^/signup",
    views: {
      'main@': {
        templateUrl: stageUrl + "main.html",
      },
    }
  })
;}]);
