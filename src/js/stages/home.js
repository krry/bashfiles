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
        controller:  function home_ctrl ($scope, syncData, SyncService, firebaseRef) {
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
        templateUrl: 'templates/footer.html',
      },
    },
  })
;});
