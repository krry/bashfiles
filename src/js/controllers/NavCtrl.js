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
    var trim1,
        trim2;

    trim1 = trimFlannel($state.current.name);
    trim2 = trimStep(trim1);

    return stage === trim2;
  }

  function trimFlannel (string) {
    return string.replace('flannel.', '');
  }

  function trimStep (string) {
    var dot = string.indexOf('.');
    return string.substr(0, dot);
  }
}
