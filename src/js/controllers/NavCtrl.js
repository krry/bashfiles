/* ==================================================

  NavCtrl

  controls data in the header

================================================== */

controllers.controller("NavCtrl", ["$scope", "$location", "Form", "Prospect", "$state", NavCtrl_]);

function NavCtrl_($scope, $location, Form, Prospect, $state) {
  var vm = this;

  vm.onActiveStage = onActiveStage;
  // vm.prospect = {} // bind with a Firebase ref for the current prospect

  function onActiveStage (stage) {
    // console.log('stage is:', stage);
    // console.log('$state is:', $state);
    return stage === $state.current.name;
  }
}
