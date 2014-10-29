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
  var stages = { 
    home: {
      name: 'home',
      destination: 'configure',
      steps: [ 
        { step: 'zip-nearme',   partial: 'zip.html'},
        { step: 'address-roof', partial: 'address.html'},
      ],
    }, 
    configure: {
      name: 'configure',
      destination: 'qualify',
      steps: [ 
        { step: 'zoom-lock-roof', url: 'zoom.html'   },
        { step: 'trace-area',     url: 'trace.html'  },
        { step: 'edit-area',      url: 'edit.html'   },
        { step: 'define-area',    url: 'define.html' },
      ],

    },
  };


  StageService.stages = stages;
  
  var currentStage = stages.home;
  console.log(currentStage)
  var currentStep  = currentStage.steps[0];
  var stepCount         = 0;

  function stepPartials(stage, step){
    var partials = [];
    for (var step in stage.steps) {
      partials.push(partialTemplate(stage, stage.steps[step]))
    }
    console.log(partials)
    return partials;
  }
  StageService.stepPartials = stepPartials;  
  
  function stepPartial(stage, step){
    console.log(stage, step)
    var partial = partialTemplate(stage, step)
    return partial;
  }
  StageService.stepPartial = stepPartial;  

  function getStage(){
    return currentStage
  }
  StageService.getStage = getStage;

  function getStep(){
    console.log('currentStep',currentStep)
    return currentStep
  }
  StageService.getStep = getStep;

  function nextStep(){
    var stage = currentStage;
    if (stepCount < stage.steps.length -1) {
      stepCount++;
      return stage.steps[stepCount];
    } else {
      currentStage = nextStage();
      return $state.go(stage.destination);
    }
  };
  StageService.nextStep = nextStep;

  function nextStage(stage){
    stage = stage || currentStage;
    stepCount = 0;
    stage = stages[stage.destination];
    return stage
  }
  StageService.nextStage = nextStage;

  function partialTemplate(stage, step) {
    console.log(step)
    console.log('partial', stage.name, step.partial )
    return [
      "/templates/stages/",
      stage.name,
      '/',
      step.partial
    ].join('')
  }

  return StageService;
}

angular.module('flannel').factory('StageService', StageService_);  

