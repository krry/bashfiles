function StageCtrl_($scope, StageService) {
  var vm = this;

  vm.stage = StageService.getStage();
  console.log('stage', vm.stage)
  
  vm.step = StageService.getStep();
  console.log('step', vm.step)

  
  vm.partials = StageService.stepPartials(vm.stage, vm.step)
  vm.partial = vm.partials[0]

  vm.nextStep = function(){
    vm.step = StageService.nextStep();
    console.log(vm.step)
    vm.partial = StageService.stepPartial(vm.stage, vm.step)
    console.log('new partial',vm.partial)
  };

  $scope.$watch(vm.stage, function(){
    StageService.stepPartial(vm.stage, vm.step)
  })
}

controllers.controller("StageCtrl", StageCtrl_);