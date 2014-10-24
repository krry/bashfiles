angular.module('steps.home',[]).config( function ($stateProvider) {
  $stateProvider.state("home", {
    url: "/",
    controller: "HomeCtrl",
    templateUrl: "templates/steps/home/home.html",
    // views: {
    // 	'header': {
    // 		templateUrl: 'templates/steps/home/header.html',
    //     controller:  "",
    // 	},
    // 	'main': {
    // 		templateUrl: 'templates/steps/plan/planContent.html',
    //     controller:  "",
    // 	},
    // 	'footer': {
    // 		templateUrl: 'templates/steps/plan/planContent.html',
    //     controller:  "",
    // 	},
    // },
  });
});
 