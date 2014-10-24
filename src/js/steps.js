angular.module('steps',[
  'steps.home',
  'steps.search',
  'steps.plan',
  // 'steps.configure',
  // 'steps.qualify',
  // 'steps.signup',
])
.config(function ($stateProvider, $urlRouterProvider) {
  $urlRouterProvider.otherwise('/');
});
