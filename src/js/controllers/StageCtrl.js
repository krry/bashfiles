function StageCtrl_($scope, StageService) {
  var vm = this;

  vm.stage = StageService.getStage();
  console.log('stage', vm.stage)
  
  vm.step = StageService.getStep();
  console.log('step', vm.step)

  vm.nextStep = function(){
    vm.step = StageService.nextStep();
    vm.partial = StageService.stepPartial(vm.stage, vm.step)
  };
  
  vm.partials = StageService.stepPartials(vm.stage, vm.step)
  vm.partial = vm.partials[0]

}

controllers.controller("StageCtrl", StageCtrl_);