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

  this.$get = ["Clientstream", "User", function SessionProviderFactory(Client, User) {
    Client.listen('User: User session_id', function(data){
      data.session_id && (_ref_key = data.session_id);
      // make the ref
      if (_ref_key) {
        _ref = new Firebase(sessions_url).child(_ref_key);
      } else {
        console.log('Session: _ref_key not set SessionProvider');
        _ref = new Firebase(sessions_url).push();
      }
      // create overservables and streams
      fb_observable = _ref.observe('value').skip(1);
      state_stream = _ref.child('state').observe('value').skip(2);

      _ref.once('value', function session_loaded(ds){
        Client.emit('Session: Session Loaded', ds);
        User.ref().update({session_id: _ref.key()});
      })
      Client.emit('Session: Session _ref_key', {session_id: _ref.key()});
    })

    /* setup listeners */
    Client.listen('User: User _ref_key', save_user );
    function save_user (data) {
      _ref.update({user_id: data.user_id});
    }

    function awesome_session_builder_brah () {
      return {
        // TODO: enable hotswap sessions
        // setRefKey: function (key){
        //   console.log('Session.setRefKey method called', key)
        //   key && (_ref_key = key);
        // },
        setUserKey: function (key){
          key && (_user_key = key);
        },
        ref: function () {return _ref;},
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
