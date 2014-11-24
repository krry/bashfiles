angular.module('stages',[
  'stages.home',
  'stages.configure',
  'stages.qualify',
  'stages.design_link',
])
.config(function ($stateProvider, $urlRouterProvider) {
  $urlRouterProvider.otherwise('/home');
});
