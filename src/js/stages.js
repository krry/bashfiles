angular.module('flannel.stages',[
  'flannel.providers',
  'design_link',
  'home',
  'configure',
  'signup',
])
.config(["$stateProvider", "$urlRouterProvider" ,"SessionProvider", function ($stateProvider, $urlRouterProvider, Session) {
  $urlRouterProvider.otherwise('/home');
}]);
