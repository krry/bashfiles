/* ==================================================
  DevCtrl
  the dev tools controller
================================================== */

controllers.controller("DevCtrl", ["$scope", "Form", DevCtrl_]);

function DevCtrl_($scope, Form) {
  var vm = this;
  vm.prospect = Form.prospect;
}
