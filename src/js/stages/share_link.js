angular.module('share_link',[]).config(["$stateProvider", function ($stateProvider) {

  // state definition

  $stateProvider.state("share_proposal", {
    url: "/share/:design_key/:bill/:utilityRate/:sctyRate",
    views: {
      'main@': {
        templateUrl: 'templates/stages/share/share_proposal.html',
        controllerAs: "share-proposal",
        controller: 'ShareCtrl',
      },
    },
  })
;}]);
