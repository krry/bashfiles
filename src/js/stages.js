angular.module('stages',[
  'stages.home',
  'stages.configure',
  'stages.qualify',
])
.config(function ($stateProvider, $urlRouterProvider) {
  $urlRouterProvider.otherwise('/home');
});
