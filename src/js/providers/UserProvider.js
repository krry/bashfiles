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
    Client.listen('App.run: User Loaded', checkForPriorSession );
    Client.listen('Session: Session Loaded', saveSessionId);

    function checkForPriorSession (ds){
      var data = ds.exportVal() || {};
      data.user_id = _ref.key();
      console.log(data)
      if (data && data.session_id) {
        // if there's a session on the object, start the process of reloading the session
        Client.emit('User: Existing session_id found', data);
      } else {
        console.log('userprovider heard app run')
        // let the app know about the user's _ref_key
        Client.emit('User: No existing session_id', {user_id: data.user_id});
      }
      Client.emit('User: Loaded', data);
    }

    function saveSessionId (data) {
      _ref.update({session_id: data.session_id});
    };

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

