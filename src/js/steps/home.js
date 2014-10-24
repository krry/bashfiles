angular.module('steps.home',[]).config( function ($stateProvider) {
  $stateProvider.state("home", {
    url: "/home",
    controller: "HomeCtrl",
    // templateUrl: "templates/steps/home/home.html",
    views: {
      'header': {
        templateUrl: 'templates/steps/home/home.html',
        controller:  "",
      },
      'main@': {
        // templateUrl: 'templates/steps/plan/planContent.html',
        // templateUrl: "templates/steps/configure/configure.html",
        template: 'main',
        controller:  "",
      },
      'footer@': {
        // templateUrl: 'templates/steps/plan/planContent.html',
        template: 'footer',
        controller:  "",
      },
    },
  });
});
