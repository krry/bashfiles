  /* ================================

    Session

    structures the user flow, e.g.:

    sessions: {
      session_id: {
        state: {
          stage: 0,
          step:  0,
        },
        event_log:  [{event},{event},{event},...],
        agent:      "agent_id",
        prospect:   "prospect_id",
        design:     "design_id",
        start_time: "timetimetime",
        end_time:   "timetimetime",
      }
    }

    TODO:
      make a private history function that keeps a record of what you've done

  ================================ */

providers.provider("Session", SessionProvider_);

function SessionProvider_ () {
  console.log('Session Provider started')

  var _ref,
      sessions_url,
      _ref_key,
      _user_key,
      fb_observable,
      state_stream;

  sessions_url = 'https://scty.firebaseio.com/sessions/';
  _ref_key = null;
  _user_key = null;

  this.setRefKey = function setRefKey(key){
    key && (_ref_key = key);
  };

  this.$get = ["$timeout","Clientstream", function SessionProviderFactory($timeout, Client) {
    /* setup listeners */



    // listen for and save successful auth to the session when you get it
    Client.listen('Session: add reference key', function (data) {
      // adding any reference key to session (form, user, etc...)
      _ref.update(data);
    });

    // listen for & save form_id to the session when you get it
    // Client.listen('form key', function (data) {
    //   console.log('Session: heard that form key: ', data);
    //   return _ref.update({ form: data });
    // });

    // // listen for & save design_id to the session when you get it
    // Client.listen('design key', function (data) {
    //   console.log('Session: heard that design key: ', data);
    //   return _ref.update({ design: data });
    // });

    function awesome_session_builder_brah () {
      return {
        setRefKey: function (key){
          key && (_ref_key = key);
        },
        setUserKey: function (key){
          key && (_user_key = key);
        },
        ref: function(){
          if (!_ref) { // TODO: may need to Delete _ref when we jump sessisons for ODAs
            if (_ref_key) {
              // _ref_key set from $cookie during angular bootstrap
              _ref = new Firebase(sessions_url).child(_ref_key);
            } else {
              _ref = new Firebase(sessions_url).push();
            }
            // establish streams
            fb_observable = _ref.observe('value').skip(1);
            state_stream = _ref.child('state').observe('value').skip(2);
          }
          // once it's back from FB emit new session
          _ref.once('value', function new_session (ds) {
            Client.emit('New Session', ds.exportVal());
          })
          return _ref;
        },
        id:     function (){ return _ref.key(); },
        stream: function (){ return fb_observable; },
        state_stream: function (){ return state_stream; },
        next:   function () { Client.emit('stage', "next");},
        back:   function () { Client.emit('stage', "back");},
      };
    }

    // always save your firebase references when you create them
    return new awesome_session_builder_brah();
  } ];
}
