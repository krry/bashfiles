function StageService_ ($state) {
  /* ================================
  Move steadily through steps, according to configurations.
  
  $scope handles stage and step count.

  Stage 1
    Step A
    Step B
    Step C
  Stage 2
    Step A
    etc...
  ================================ */
  var StageService = {};
  var stages = [ 
    { name: 'home',
      destination: 'configure',
      steps: [ 
        { step: 'zip-nearme',   url: 'zip.html'},
        { step: 'address-roof', url: 'address.html'},
      ],
    },
  ];
  var currentStage = null;
  var currentStep  = 0;

  function templateUrl(stage){
    return [
      "/templates/stages/",
      stage.name,
      '/',
      // stage.steps[currentStep-1].url
    ].join('')
  }
  StageService.templateUrl = templateUrl;  


  function getStage(name) {
    var stage = stages[name];
    currentStage = stages[name];
    steps = currentStage.steps;
    return currentStage;
  };

  function current(){
    currentStage = currentStage ? stages[currentStage] : stages[0];
    return currentStage 
  }
  StageService.current = current;

  function nextStep(){
    var stage = currentStage;
    var step = currentStep;
    if (currentStep < stage.steps.length) {
      currentStep++
      return stage.steps[step];
    } else {
      currentStep = 0;
      currentStage = stages[stage.destination];
      $state.go(stage.destination);
    }
  };
  StageService.nextStep = nextStep;

  return StageService;
}

angular.module('flannel').factory('StageService', StageService_);  
