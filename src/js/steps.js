angular.module('steps',[
  'stage.home',
  'steps.search',
  'steps.plan',
  'steps.configure',
  'steps.qualify',
  // 'steps.signup',
])
.config(function ($stateProvider, $urlRouterProvider) {
  // $stateProvider.state("app", {
  //   url: "/",
  //   // templateUrl: 'templates/main.html',
  //   // views: {
  //   //   'header@': {
  //   //     templateUrl: "templates/header.html",
  //   //     controller:  function(){console.log('header');},
  //   //   },
  //   //   'main@': {
  //   //     templateUrl: "templates/main.html",
  //   //     controller: function(){console.log('main at root');},
  //   //   },
  //   //   'footer@': {
  //   //     templateUrl: "templates/footer.html",
  //   //     controller:  "",
  //   //   },
  //   // },
  // })
  $urlRouterProvider.otherwise('/');
});