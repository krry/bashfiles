angular.module('stages',[
  'flannel.providers',
  'design_link',
  'home',
  'configure',
  'signup',
])
.config(["$stateProvider", "$urlRouterProvider", function ($stateProvider, $urlRouterProvider) {
  $urlRouterProvider.when('', '/index');
  $urlRouterProvider.otherwise('/home');
}]).run([function ui_router_run() {
  // this runs after all the dependencies are bootstrapped
}]);
