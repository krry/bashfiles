/* ==================================================

  AppCtrl
  the core app controller

  to be used only for functions to which the entire
  app needs access, especially for <title>, <meta>,
  and other <head> elements

================================================== */

controllers.controller("AppCtrl", ['GMAP_CLIENT', 'MINIFIED', AppCtrl_]);

function AppCtrl_(GMAP_CLIENT, MINIFIED) {
  var vm = this;
  vm.gmapClient = GMAP_CLIENT;
  vm.minified = MINIFIED;
}
