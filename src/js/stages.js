angular.module('stages',[
  'flannel.providers',
  'design_link',
  'home',
  'configure',
  'signup',
])
.config(["$locationProvider", "$stateProvider", "$urlRouterProvider", function ($locationProvider, $stateProvider, $urlRouterProvider) {
  $locationProvider.hashPrefix(''); // remove angular's # and let $location.hash make more sense
  $urlRouterProvider.otherwise('/'); // if users arrive somewhere other than the root URL, send them to the root.
}]).run([function ui_router_run() {
  // this runs after all the dependencies are bootstrapped
}]);
