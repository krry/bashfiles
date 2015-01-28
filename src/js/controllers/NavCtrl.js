/* ==================================================

  NavCtrl

  controls data in the header

================================================== */

controllers.controller("NavCtrl", ["$scope", "$location", "Form", "Prospect", NavCtrl_]);

function NavCtrl_($scope, $location, Form, Prospect) {
  var vm = this;

  vm.onActiveStage = onActiveStage;
  // vm.prospect = {} // bind with a Firebase ref for the current prospect

  function onActiveStage (viewPath) {
    return viewPath === $location.path();
  }
}
