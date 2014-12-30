controllers.controller("FooterCtrl", FooterCtrl_);

function FooterCtrl_($scope, StageService) {
  var vm = this;

  // $scope.stage = StageService.current();
  // console.log($scope.stage)
  // $scope.step = StageService.nextStep();

  // vm.nextStep = function(){
  //   $scope.step = StageService.nextStep();
  // };

  // $scope.stepTemplate = StageService.partialUrl($scope.stage)
  // $scope.$watch($scope.stage, templateUrl);
  

  // function templateUrl() {
  //   $scope.stepTemplate = StageService.partialUrl($scope.stage, $scope.step);
  // }
  // templateUrl();
}
