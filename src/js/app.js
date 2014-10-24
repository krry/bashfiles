angular.module('edliter', [
  'ui.router',
  'ui.bootstrap',
  'ngTouch',
  'states',
  'app.controllers',
  'app.directives',
  'app.options',
]).config(function($sceDelegateProvider, $sceProvider, $httpProvider) {
  $sceDelegateProvider.resourceUrlWhitelist([
   // Allow same origin resource loads.
   'self',
   'http://localhost:8100/**',
   // Allow loading from our assets domain.  Notice the difference between * and **.
   'http://scexchange.solarcity.com/scfilefactory/testfill.aspx'
  ]);
  $sceProvider.enabled(false);
  $httpProvider.defaults.useXDomain = true;
  delete $httpProvider.defaults.headers.common['X-Requested-With'];
    
}).run(function() {
  
});

var controllers = angular.module('app.controllers',[]);
var directives  = angular.module('app.directives',[]);
var options     = angular.module('app.options',[]);
