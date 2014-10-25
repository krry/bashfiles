angular.module('steps.home',[]).config( function ($stateProvider) {
  
  // specifics for for this state
  var stateName = 'home';
  var baseUrl = 'templates/steps/' + stateName + '/';

  var steps = [ 
    { step: 'zip-nearme',   url: baseUrl + 'zip.html'},
    { step: 'address-roof', url: baseUrl + 'address.html'},
  ];

  var destination = 'configure.initial'

  // state definition
  $stateProvider.state("home", {
    url: "",
    abstract: true,
    views: {
      'header@': {
        templateUrl: baseUrl + "header.html",
        controller:  "",
      },
      'main@': {
        templateUrl: baseUrl + "main.html",
        controllerAs: 'home',
        controller: function HomeCtrl($scope, $state){
          var currentstep = 0;
          var vm = this;
          vm.nextStep = function nextStep(cur){
            currentstep < steps.length - 1 ? 
              currentstep++ : $state.go(destination);
            vm.step=vm.steps[currentstep];
          };
          vm.steps = steps;
          vm.step = vm.steps[currentstep];
        },
      },
      'footer@': {
        templateUrl: baseUrl + "footer.html",
        controller:  "",
      },
    },
  })
  .state("home.initial", {
    url: '/initial',
    views: {
      'overlay@home': {
        templateUrl: baseUrl + "overlay.html",
        controller:  "",
      },
      'underlay@home': {
        templateUrl: baseUrl + "underlay.html",
        controller:  "",
      },
    },
  })
;});
