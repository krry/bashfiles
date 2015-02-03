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

providers.provider("User", ["SessionProvider", UserProvider_]);

function UserProvider_ (SessionProvider) {
  var _ref,
      _ref_key,
      users_url,
      fb_observable;

  users_url = "https://scty.firebaseio.com/users/";

  this.setRefKey = function(key){
    key && (_ref_key = key);
    key && (this._ref_key = key);
  };

  this.$get = ["$http", "$cookies", "Clientstream", function userProviderFactory ($http, $cookies, Client) {
    // User is the first Provider loaded for the application.
    // It contains the key to the most recent session, or if there's no key, it will need to get a new session.


    // Get /jwt.  Use the resulting data (a jwt) and pass it to FireBase for authentication
    $http.get('/jwt').success(function jwt_callback(data) {
      var ref = new Firebase(users_url);
      ref.authWithCustomToken(data, function(error, authData) {
        if (error) {
          console.log("Login Failed!", error);
          } else {
          console.log("Login Succeeded!", authData);
        }
      });
    }).error(function (a,b,c,d) {
      console.log("There was an error getting the jwt.");
    });

    Client.listen('User: current session', function save_session_to_user (data){
      _ref.update(data);
    });


    function user_assembly () {
      return {
        setRefKey: function (key){
          key && (_ref_key = key);
        },
        ref: function(){
          if (!_ref) { // TODO: may need to Delete _ref when we jump sessisons for ODAs
            if (_ref_key) {
              // _ref_key set from $cookie during angular bootstrap
              _ref = new Firebase(users_url).child(_ref_key);
            } else {
              alert('this shouldn\'t happen');
              _ref = new Firebase(sessions_url).push();
            }
            // establish streams
            fb_observable = _ref.observe('value').skip(1);
            state_stream = _ref.child('state').observe('value').skip(2);
          }
          // once it's back from FB emit new session
          _ref.once('value', function new_session (ds) {
            Client.emit('New User', ds.exportVal());
          })
          return _ref;
        },


        // ref: function(uid){
        //   if (uid && (typeof uid === "string" || typeof uid === "number")) {
        //     // if App.js detected a cookie with uid, we have a returning user
        //     _ref_key = uid;
        //     _ref = new Firebase(users_url).child(_ref_key);
        //     // get the last session from the user & tell Session about user key
        //     _ref.child('session_id').once('value', function update_session(ds){
        //       console.log('session_id', ds.exportVal());
        //       Client.emit('Session: add reference key', {user_id: _ref_key});
        //     })
        //   }
        //   return _ref || (_ref = new Firebase(users_url).child(_ref_key)); // TODO: does this need to be able to push?
        // },
        id: function () { return _ref.key(); }
      };
    }

    return new user_assembly();

}]}

