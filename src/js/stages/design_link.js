angular.module('design_link',[]).config(["$stateProvider", function ($stateProvider) {

  // specifics for for this state
  var stageName = 'design_link';
  // state definition
  var templateUrl = "templates/";
  // var stageUrl = templateUrl + "/stages/" + stageName + '/';

  $stateProvider.state("design_link", {
    url: "/oda/:design_ref_key",
    views: {
      'header@': {
        templateUrl: templateUrl + 'header.html',
        controller:  'NavCtrl as nav',
      },
      'main@': {
        templateUrl: templateUrl +'design_link.html',
        controller: function design_link_ctrl ($stateParams, $state, Clientstream, User) {
          var user_id,
              design_ref;
          design_ref = $stateParams.design_ref_key;
          Clientstream.emit('ODA: Request session',design_ref);
        },
      },
    },
  })
;}]);
