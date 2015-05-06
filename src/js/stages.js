angular.module('stages',[
  'flannel.providers',
  'design_link',
  'share_link',
  'overview_link',
  'session_link',
  'home',
  'configure',
  'proposal',
  'signup',
])
.config(["$locationProvider", "$stateProvider", "$urlRouterProvider", function ($locationProvider, $stateProvider, $urlRouterProvider) {
  $urlRouterProvider.otherwise('/my-home/zip-nearme'); // if users arrive somewhere other than the root URL, send them to the root.
  $stateProvider.state('flannel', {
    url: "/",
    abstract: true,
    resolve: {
      // Resolve ensures we authenticate before going to the root controller
      // This only fires once since the root only instantiates once
      init: ['Auth', function(Auth) {
        return Auth.authenticate();
      }]
    },
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

}]).run(['$rootScope', '$state', '$window', 'Clientstream', 'User', function ui_router_run($rootScope, $state, $window, Client, User) {
  // this runs after all the dependencies are bootstrapped
  $rootScope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams) {
    // Avoid emitting when arriving from share_link
    if (toState.name === 'share_proposal') {return}
    else if (toState.name === 'overview' || $state.current.name === 'overview') { return }
    else if (toState.name === 'session_link') {
      User.isNew = false;
      Client.emit('ODA: Request session', toParams.session_ref_key);
      Client.emit('Stages: set initial state', ['flannel', toParams.stage, toParams.step].join('.'));
      return;
    }

    // Avoid emitting when transitioning to a new stage, which is an intermediary abstract state and has no step
    if (toState.step === 0 || toState.step) {
      Client.emit('Router: state change success', { stage: toState.stage, step: toState.step });

      $window.scrollTo(0, 0);
      // TODO: figure out why form fields are overriding the scroll jack
      $window.setTimeout(function() {
        $window.scrollTo(0, 0);
      }, 0);
    }
  });
}]);
