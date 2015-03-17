/* ==================================================

  NavCtrl

  controls data in the header

================================================== */

controllers.controller("NavCtrl", ["$scope", "$state", "Form", NavCtrl_]);

function NavCtrl_($scope, $state, Form) {
  var vm = this;
  vm.prospect = Form.prospect;

  vm.onActiveStage = onActiveStage;

  function onActiveStage (stage) {
    return stage === $state.current.name;
  }
}
