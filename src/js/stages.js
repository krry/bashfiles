angular.module('stages',[
  'stages.home',
  'stages.configure',
  'stages.qualify',
  'stages.design_link',
  'stage.signup',
])
.config(function ($stateProvider, $urlRouterProvider) {
  $urlRouterProvider.otherwise('/home');
});
