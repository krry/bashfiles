function FooterCtrl_($scope, StageService) {
  var vm = this;

  $scope.stage = StageService.current();
  console.log($scope.stage)
  $scope.step = StageService.nextStep();

  vm.nextStep = function(){
    $scope.step = StageService.nextStep();
  };
  var stepTemplate = StageService.templateUrl($scope.stage)
  // $scope.templateUrl = stepTemplate;
  $scope.templateUrl = '/templates/stages/home/zip.htm'

}

controllers.controller("FooterCtrl", FooterCtrl_);