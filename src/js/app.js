angular.module('flannel', [
  'ngCookies',
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
  'nouislider'
]).config(function($sceDelegateProvider, $sceProvider, $httpProvider) {
  $sceDelegateProvider.resourceUrlWhitelist([
   // Allow same origin resource loads.
   'self',
   // Allow loading from our assets domain. Notice the difference between * and **.
   'http://localhost:8100/**',
   'http://scexchange.solarcity.com/scfilefactory/testfill.aspx'
  ]);
  $sceProvider.enabled(false);
  $httpProvider.defaults.useXDomain = true;
  delete $httpProvider.defaults.headers.common['X-Requested-With'];
}).run(function($cookies, User) {
  // pull the user id from an existing cookie
  var uid = $cookies.uuid
  typeof uid !== "undefined" && (uid = uid.split(":")[1].split(".")[0]) // hack: is this too ugly to live?
  // if there was an existing cookie, then we'll grab the existing user.
  uid && User.ref(uid); // todo: could this be authUserAndUpdateRef instead?
});

var providers   = angular.module('flannel.providers',[]);
var controllers = angular.module('flannel.controllers',[]);
var directives  = angular.module('flannel.directives',[]);
var options     = angular.module('flannel.options',[]);

