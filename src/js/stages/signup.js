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
        controller:  function ($timeout, Clientstream) {
          // HACK: enable quick routing through app
          $timeout(function(){
            Clientstream.emit('stage', {stage: 2, step: 0});
          }, 1)
        },
      },
      'header@': {
        templateUrl: templateUrl + 'header.html',
        controller: 'NavCtrl as nav',
      },
      'footer@': {
        templateUrl: templateUrl + 'footer.html',
        controller: 'FooterCtrl as footer',
      },
    }
  })
;}]);
