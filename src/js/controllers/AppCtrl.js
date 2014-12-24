/* ==================================================
  AppCtrl
  the core app controller
================================================== */

controllers.controller("AppCtrl", ['config', AppCtrl_]);

function AppCtrl_(config) {
  var vm = this;

  vm.gmapClient = config.GMAP_CLIENT;
}
