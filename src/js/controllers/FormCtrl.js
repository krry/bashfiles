function FormCtrl_($scope, FormService) {
  var vm = this;

  $scope.user = FormService.userObj;

  vm.zipCheck = function() {
    console.log("zipCheck called");
  }
}

controllers.controller("FormCtrl", FormCtrl_);
