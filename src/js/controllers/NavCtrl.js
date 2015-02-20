/* ==================================================

  NavCtrl

  controls data in the header

================================================== */

controllers.controller("NavCtrl", ["$scope", "$state", NavCtrl_]);

function NavCtrl_($scope, $state) {
  var vm = this;

  vm.onActiveStage = onActiveStage;

  function onActiveStage (stage) {
    return stage === $state.current.name;
  }
}
