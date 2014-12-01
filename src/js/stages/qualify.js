// qualify.js
angular.module('stages.qualify',[]).config( function ($stateProvider) {

  // specifics for for this state
  var stateName = 'qualify';
  var templateUrl = 'templates/';
  var stepsUrl = 'steps/';
  var baseUrl = templateUrl + stepsUrl + stateName + '/';

  var steps = [
    { step: 'final', url: baseUrl + 'final.html'   },
  ];

  var destination = null;

  $stateProvider.state("qualify", {
    url: "",
    abstract: true,
    views: {
      'header@': {
        templateUrl: baseUrl + "header.html",
        controller:  "",
      },
      'main@': {
        templateUrl: baseUrl + "main.html",
        controllerAs: stateName,
        controller: function QualifyCtrl($scope, $state){
          var currentStep = 0;
          var vm = this;
          vm.nextStep = function nextStep(cur){
            currentStep < steps.length - 1 ?
              currentStep++ : $state.go(destination);
            vm.step=vm.steps[currentStep];
          };
          vm.steps = steps;
          vm.step = vm.steps[currentStep];
        },
      },
      'footer@': {
        templateUrl: templateUrl + "footer.html",
        controller:  "",
      },
    },
  })
  .state("qualify.initial", {
    url: '/qualify',
    views: {
      'major@qualify': {
        templateUrl: baseUrl + "major.html",
        controller:  "",
      },
      'minor@qualify': {
        templateUrl: baseUrl + "minor.html",
        controller:  "",
      },
    },
  })
;});
