/* ============================================================

  UserProvider

  provides a new user reference. or use .ref(uid_from_firebase_token) to update
  _ref to existing user across the application.

  user data structure, e.g.:

  users: {
    <jwt.uid>: {
      user_type: {"PROSPECT", "ODA", "ADMIN", "OTHER"},
      name: {
        first_name: "Llamo",
        last_name: "Llama"
      },
      last_session:  <session_id>,
      sessions: [<sessionA_id>, <sessionB_id>, <sessionC_id>, ...],
    }
  }

============================================================ */

providers.provider("User", [ "SessionProvider", UserProvider_]);

function UserProvider_ (SessionProvider) {
  var _ref,
      _ref_key,
      users_url,
      fb_observable,
      state_stream;

  users_url = "https://scty.firebaseio.com/users/";

  this.setRefKey = function(key){
    _ref_key = key;
    _ref = new Firebase(users_url).child(_ref_key);
    // if user is returning, set the session _ref_key
    _ref.once('value', function(ds) {
      // when firebase tells us about the User object
      if (ds.exportVal() !== null) { // if user is returning
        // set the session _ref_key
        SessionProvider.setRefKey(ds.exportVal().session_id);
      }
    });

    return ref_setup(_ref);
  };

  function ref_setup (ref) {
    fb_observable = ref.observe('value').skip(1);
    state_stream = ref.child('state').observe('value').skip(2);
    return ref;
  }

  this.$get = ["$cookies", "Clientstream", function userProviderFactory ($cookies, Client) {
    // User is the first Provider loaded for the application.
    // It contains the key to the most recent session, or if there's no key, it will need to get a new session.
    $cookies.user_id = _ref.key();
    // listen for the session to load, save it's _ref_key to the user
    Client.listen('App.run: User Loaded', function save_session_to_user (ds){
      var data = ds.exportVal();
      var user_id = _ref.key();
      var session_id = data ? data.session_id : null;
      Client.emit('User: User session_id', {session_id: session_id});
      Client.emit('User: User _ref_key', {user_id: user_id});
    });

    function user_builder_brah () {
      return {
        ref: function(){
          // return ref if we have it already // TODO: should we be able to change user?
          if (_ref) return _ref;
          return null;
        },
        id: function () { return _ref.key(); },
      };
    }

    return new user_builder_brah();

}]}

