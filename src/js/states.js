angular.module('states',[
  'states.home',
  'states.search',
  'states.plan',
])
.config(function ($stateProvider, $urlRouterProvider) {
  $urlRouterProvider.otherwise('/');
});
