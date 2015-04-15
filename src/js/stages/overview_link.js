angular.module('overview_link', []).config(["$stateProvider", function ($stateProvider) {
  // state definition

  $stateProvider.state("overview", {
    url: "/overview",
    views: {
      'header@': {
        templateUrl: 'templates/stages/overview/overview_header.html',
      },
      'main@': {
        templateUrl: 'templates/stages/overview/overview_proposal.html',
        controllerAs: "overview",
        controller: 'OverViewCtrl',
      },
    },
  })
;}]);
