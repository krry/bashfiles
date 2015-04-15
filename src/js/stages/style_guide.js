angular.module('style_guide', []).config(["$stateProvider", function ($stateProvider) {
  // state definition

  $stateProvider.state("style_guide", {
    url: "/styles",
    views: {
      'header@': {
        templateUrl: 'templates/header.html',
      },
      'main@': {
        templateUrl: 'templates/stages/styles/style_guide.html',
        controllerAs: "style",
        controller: 'StyleCtrl',
      },
    },
  })
;}]);
