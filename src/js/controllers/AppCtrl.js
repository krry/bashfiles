/* ==================================================

  AppCtrl
  the core app controller

  to be used only for functions to which the entire
  app needs access, especially for <title>, <meta>,
  and other <head> elements

================================================== */

controllers.controller("AppCtrl", ['GMAP_CLIENT', 'MINIFIED', 'APP_TITLE', AppCtrl_]);

function AppCtrl_(GMAP_CLIENT, MINIFIED, APP_TITLE) {
  var vm = this;
  vm.gmapClient = GMAP_CLIENT;
  vm.minified = MINIFIED;
  vm.appTitle = APP_TITLE;
}
