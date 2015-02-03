/* ==================================================

  AppCtrl
  the core app controller

  to be used only for functions to which the entire
  app needs access, especially for <title>, <meta>,
  and other <head> elements

================================================== */

controllers.controller("AppCtrl", ['$sce', 'GMAP_CLIENT', 'MINIFIED', 'APP_TITLE', AppCtrl_]);

function AppCtrl_($sce, GMAP_CLIENT, MINIFIED, APP_TITLE) {
  var vm = this;
  vm.gmapClient = GMAP_CLIENT;
  // console.log("vm.gmapClient is", vm.gmapClient);
  // vm.gmapClient = $sce.trustAs("resource_url", "http://maps.googleapis.com/maps/api/js?v=3.exp&libraries=places&sensor=false&client="+GMAP_CLIENT);
  vm.minified = MINIFIED;
  vm.appTitle = APP_TITLE;
}
