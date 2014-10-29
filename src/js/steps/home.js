angular.module('stage.home',[]).config( function ($stateProvider) {
  
  // specifics for for this state
  var stageName = 'home';
  var templateUrl = 'templates/';
  var stageUrl = 'templates/stages/' + stageName + '/';

  // var steps = [ 
  //   { step: 'zip-nearme',   url: stageUrl + 'zip.html'},
  //   { step: 'address-roof', url: stageUrl + 'address.html'},
  // ];

  var destination = 'configure.initial'

  // state definition
  $stateProvider.state("home", {
    url: "/home",
    views: {
      'header@': {
        templateUrl: 'templates/header.html',
        controller:  'HeaderCtrl as head',
      },
      'main@': {
        templateUrl: stageUrl + "main.html",
        // controllerAs: 'stage',
        // controller:  function HomeCtrl($scope, $state){
        //   var currentStep = 0;
        //   var vm = this;
        //   vm.nextStep = function nextStep(){
        //     currentStep < steps.length - 1 ? 
        //       currentStep++ : $state.go(destination);
        //     vm.step=vm.steps[currentStep];
        //   };
        //   vm.steps = steps;
        //   vm.step = vm.steps[currentStep];
        // },
      },
      'overlay@home': {
        templateUrl: stageUrl + "overlay.html",
        controller:  "",
      },
      'underlay@home': {
        templateUrl: stageUrl + "underlay.html",
        controller:  "",
      },
      'footer@': {
        templateUrl: 'templates/footer.html',
        // controller: 'FooterCtrl as foot',
      },
    },
  })
;});
