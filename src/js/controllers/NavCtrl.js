/* ==================================================

  NavCtrl

  controls data in the header

================================================== */

controllers.controller("NavCtrl", ["$scope", "$state", NavCtrl_]);

function NavCtrl_($scope, $state) {
  var vm = this;

  vm.onActiveStage = onActiveStage;

  function onActiveStage (stage) {
    // console.log('stage is:', stage);
    // console.log('$state is:', $state);
    return stage === $state.current.name;
  }
}
