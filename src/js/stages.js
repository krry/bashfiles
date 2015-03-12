angular.module('stages',[
  'flannel.providers',
  'design_link',
  'home',
  'configure',
  'proposal',
  'signup',
])
.config(["$locationProvider", "$stateProvider", "$urlRouterProvider", function ($locationProvider, $stateProvider, $urlRouterProvider) {
  // $urlRouterProvider.otherwise('/my-home'); // if users arrive somewhere other than the root URL, send them to the root.
  $stateProvider.state('flannel', {
    url: "/",
    abstract: true,
    views: {
      'header@': {
        templateUrl: 'templates/header.html',
        controller: 'NavCtrl as nav',
      },
      'footer@': {
        templateUrl: 'templates/footer.html',
        controller: 'FooterCtrl as footer',
      },
    }
  })

}]).run([function ui_router_run() {
  // this runs after all the dependencies are bootstrapped
}]);
