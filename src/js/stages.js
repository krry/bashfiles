angular.module('stages',[
  'stage.home',
  'stage.configure',
  'stage.qualify',
  'stage.signup',
])
.config(function ($stateProvider, $urlRouterProvider) {
  $urlRouterProvider.otherwise('/home');
});