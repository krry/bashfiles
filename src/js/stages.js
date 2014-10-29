angular.module('stages',[
  'stage.home',
  'stage.configure',
  'stage.signup',
])
.config(function ($stateProvider, $urlRouterProvider) {

  $urlRouterProvider.otherwise('/');
});