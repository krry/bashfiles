angular.module('flannel', [
  'ngCookies',
  'flannel.config',
  'ui.router',
  'firebase',
  'rx',
  'ngTouch',
  'stages',
  'flannel.templates',
  'flannel.providers',
  'flannel.firebase',
  'flannel.controllers',
  'flannel.directives',
  'flannel.constants',
  'nouislider'
]).config(['$sceDelegateProvider', '$sceProvider', '$httpProvider', 'UserProvider', 'MailgunProvider', function($sceDelegateProvider, $sceProvider, $httpProvider, UserProvider, MailgunProvider) {
  // hack: sorta hacky... but maybe not.
  // http://stackoverflow.com/questions/20588114/how-to-use-cookiesprovider-in-angular-config
  var $cookies, uid;
  angular.injector(['ngCookies']).invoke(function(_$cookies_) {
    $cookies = _$cookies_;
  });

  // $cookies.uuid is set by the server after getting an auth token from Firebase
  uid = $cookies.uuid;
  /* jshint -W030 */
  uid && (uid = uid.split(":")[1].split(".")[0]); // hack: is this too ugly to live?
  /* jshint +W030 */
  if ($cookies.user_id) {
    // returning visitor
    console.log('**** VISITOR HAS 1 WHOLE COOKIE ****', $cookies.user_id);
    // make the User provider use the correct user
    UserProvider.setRefKey($cookies.user_id);
  } else {
    // new visitor
    console.log('**** VISITOR HAS NO COOKIE ****', uid);
    UserProvider.setRefKey(uid);
  }

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

  // mailgun options for email validation service
  var mailgunOptions = {
    api_key: 'pubkey-38f603eccf9df24d29de2c548c3d5a55',
    in_progress: null,
    success: null,
    error: null,
  };
  MailgunProvider.configure(mailgunOptions);

}]).run(["User", "Clientstream", function run_app(User, Client) {
  // let the app know we've gotten the important stuff :)
  User.ref().once('value', function setSessionFromUser (ds) {
    // let session know we've loaded the User. now load the session.
    Client.emit('App.run: User Loaded', ds);
  });
}]);

var providers   = angular.module('flannel.providers',[]);
var controllers = angular.module('flannel.controllers',[]);
var directives  = angular.module('flannel.directives',[]);
var options     = angular.module('flannel.options',[]);
var constants   = angular.module('flannel.constants', []);
