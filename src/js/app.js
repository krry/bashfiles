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
]).config(function($sceDelegateProvider, $sceProvider, $httpProvider, UserProvider, SessionProvider) {
  // hack: sorta hacky... but maybe not.
  // http://stackoverflow.com/questions/20588114/how-to-use-cookiesprovider-in-angular-config
  var $cookies, uid;
  angular.injector(['ngCookies']).invoke(function(_$cookies_) {
    $cookies = _$cookies_;
  });
  if ($cookies.uuid) {
    // pull the user id from an existing cookie
    uid = $cookies.uuid;
    uid = uid.split(":")[1].split(".")[0]; // hack: is this too ugly to live?
    // make the User provider use the previous user
    console.log('**** VISITOR HAS 1 WHOLE COOKIE ****', $cookies, uid);
    UserProvider.setRefKey(uid);
  } else {
  // TODO: otherwise what?
    console.log('**** VISITOR HAS NO COOKIE ****');
  }
  if ($cookies.session_id) {
    SessionProvider.setRefKey($cookies.session_id);
  }

  // hack: end of $cookie hack
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
}).run(["$cookies","User", "Session", "Clientstream", function run_app($cookies, User, Session, Client) {
  // $cookies.session_id = "butts_session"; // HACK: DEV: save

  User.ref().once('value', function(ds){
    var data = ds.exportVal();
    if (data.session_id) {
      // there's an existing session_id on the user object, set the Session provider's reference key
      Session.setRefKey(ds.exportVal().session_id);
    } else {
      // Just set the User key for later use by Session
      Session.setUserKey(ds.ref().key());
    }
  })

  Client.listen('Session: New Session', function setCookieSession (ds){
    ds.ref().key() !== $cookies.session_id && (console.log('updating session_id on cookies. current:', $cookies.session_id, 'new:', ds.ref().key()));
    ds.ref().key() !== $cookies.session_id && ($cookies.session_id = ds.ref().key());
  })

}]);

var providers   = angular.module('flannel.providers',[]);
var controllers = angular.module('flannel.controllers',[]);
var directives  = angular.module('flannel.directives',[]);
var options     = angular.module('flannel.options',[]);
