angular.module('share_link', []).config(["$stateProvider", function ($stateProvider) {
  // state definition

  $stateProvider.state("share_proposal", {
    url: "/share/:design_key/:bill/:utilityRate/:sctyRate/:averageYield/:lat/:lng",
    views: {
      'header@': {
        templateUrl: 'templates/stages/share/share_header.html',
      },
      'main@': {
        templateUrl: 'templates/stages/share/share_proposal.html',
        controllerAs: "share",
        controller: 'ShareCtrl',
      },
    },
  })
;}]);
