angular.module('stages',[
  'stages.design_link',
  'stages.home',
  'stages.configure',
  'stages.signup',
])
.config(function ($stateProvider, $urlRouterProvider) {
  $urlRouterProvider.otherwise('/home');
});
