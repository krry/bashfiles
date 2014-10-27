angular.module('steps.configure',[]).config( function ($stateProvider) {
  
  // specifics for for this state
  var stateName = 'configure';
  var templateUrl = 'templates/';
  var stepsUrl = 'steps/';
  var baseUrl = templateUrl + stepsUrl + stateName + '/';

  var steps = [ 
    { step: 'zoom-lock-roof', url: baseUrl + 'zoom.html'   },
    { step: 'trace-area',     url: baseUrl + 'trace.html'  },
    { step: 'edit-area',      url: baseUrl + 'edit.html'   },
    { step: 'define-area',    url: baseUrl + 'define.html' },
  ];

  var destination = 'qualify.initial'

  $stateProvider.state("configure", {
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
        controller: function ConfigureCtrl($scope, $state){
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
  .state("configure.initial", {
    url: '/configure',
    views: {
      'map@configure': {
        templateUrl: baseUrl + "map.html",
        controller:  "",
      },
      'instructions@configure': {
        templateUrl: baseUrl + "instructions.html",
        controller:  "",
      },
    },
  })
;});
