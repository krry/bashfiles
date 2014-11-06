angular.module('stages.qualify',[]).config( function ($stateProvider) {
  
  // specifics for for this state
  var stateName = 'qualify';
  var templateUrl = 'templates/';
  var stagesUrl = 'stages/';
  var baseUrl = templateUrl + stagesUrl + stateName + '/';

  var steps = [ 
    { step: 'final', url: stageUrl + 'final.html' },
  ];

  var destination = null;

  $stateProvider.state("qualify", {
    url: "",
    abstract: true,
    views: {
      'header@': {
        templateUrl: templateUrl + "header.html", 
        controller:  "HeaderCtrl as header",
      },
      'main@': {
        templateUrl: stageUrl + "main.html",
        controllerAs: stageName,
        controller: function QualifyCtrl($scope, $state){
          var currentStep = 0;
          var vm = this;
          vm.nextStep = function nextStep(cur){
            if (currentStep < steps.length - 1) {
              currentStep++;
            } else {
              $state.go(destination);
            }
            vm.step=vm.steps[currentStep];
          };
          vm.steps = steps;
          vm.step = vm.steps[currentStep];
        },
      },
      'footer@': {
        templateUrl: templateUrl + "footer.html",
        controller:  "FooterCtrl as footer",
      },
    },
  })
  .state("qualify.initial", {
    url: '/qualify',
    views: {
      'major@qualify': {
        templateUrl: stageUrl + "major.html",
        controller:  "",
      },
      'minor@qualify': {
        templateUrl: stageUrl + "minor.html",
        controller:  "",
      },
    },
  })
;});
