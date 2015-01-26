angular.module('flannel', [
  'flannel.config',
  'ui.router',
  // 'ui.bootstrap',
  'firebase',
  'rx',
  'ngTouch',
  'stages',
  'flannel.providers',
  'flannel.firebase',
  'flannel.controllers',
  'flannel.directives',
]).config(function($sceDelegateProvider, $sceProvider, $httpProvider) {
  $sceDelegateProvider.resourceUrlWhitelist([
   // Allow same origin resource loads.
   'self',
   'http://localhost:8100/**',
   // Allow loading from our assets domain. Notice the difference between * and **.
   'http://scexchange.solarcity.com/scfilefactory/testfill.aspx'
  ]);
  $sceProvider.enabled(false);
  $httpProvider.defaults.useXDomain = true;
  delete $httpProvider.defaults.headers.common['X-Requested-With'];
}).run(function() {

});

var providers   = angular.module('flannel.providers',[]);
var controllers = angular.module('flannel.controllers',[]);
var directives  = angular.module('flannel.directives',[]);
var options     = angular.module('flannel.options',[]);
