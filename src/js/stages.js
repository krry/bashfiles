angular.module('stages',[
  'flannel.providers',
  'design_link',
  'home',
  'configure',
  'signup',
])
.config(["$locationProvider", "$stateProvider", "$urlRouterProvider", function ($locationProvider, $stateProvider, $urlRouterProvider) {
  $urlRouterProvider.otherwise('/');
}]).run([function ui_router_run() {
  // this runs after all the dependencies are bootstrapped
}]);
