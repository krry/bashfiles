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
        templateUrl: templateUrl + 'header.html',
        controller:  'HeaderCtrl as head',
      },
      'main@': {
        resolve: {},
        templateUrl: stageUrl + "main.html",
        controllerAs: "home",
        controller:  function home_ctrl ($scope, SyncService, firebaseRef) {
          // the design_ref may be set by arriving from a share link, or should be generated new
          $scope.designRef = SyncService.get('design_ref') || firebaseRef('/designs').push()
          .once( 'value', function (dataSnapshot) {
            SyncService.set('design_ref', dataSnapshot);
            console.log('your design id is new: ', dataSnapshot.key());
          });
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
;});
