angular.module('flannel.stages',[
  'flannel.providers',
  'design_link',
  'home',
  'configure',
  'signup',
])
.config(["$stateProvider", "$urlRouterProvider", function ($stateProvider, $urlRouterProvider) {
  $urlRouterProvider.otherwise('/home');
}]);
