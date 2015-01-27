angular.module('stages',[
  'flannel.providers',
  'design_link',
  'home',
  'configure',
  'signup',
])
.config(["$stateProvider", "$urlRouterProvider", function ($stateProvider, $urlRouterProvider) {
  $urlRouterProvider.otherwise('/home');
}]).run(["Session", "Clientstream", function ui_router_run(Session, Client) {
  // this runs after all the dependencies are bootstrapped
  console.log('********************* running ui_router')

  // Client.emit('existing user', {stage: 1, step: 0});
  // var state_ref;
  // state_ref = Session.ref().child('state')
  // state_ref.set({
  //   stage: 1,
  //   step:  0
  // });
  // state_ref.on('value', function(){
  //   console.log(arguments)
  //   console.log(arguments[0].val())

  // })
}]);
