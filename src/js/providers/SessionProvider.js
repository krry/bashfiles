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

providers.provider("Session", ['FormProvider', 'DesignProvider', SessionProvider_]);

function SessionProvider_ (FormProvider, DesignProvider, ConfiguratorProvider) {
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
    /* jshint -W030 */
    key && (_ref_key = key);
    /* jshint +W030 */
    // console.log('ref_key in sessionProvider being set:', key);
  };

  this.$get = ["Clientstream", function SessionProviderFactory(Client) {

    Client.listen('User: Loaded', bootstrapSession );
    // Client.listen('Stage: subscribed to statestream', loadSession );
    Client.listen('StageCtrl: restart session', restartSession);
    Client.listen('Form: Loaded', saveFormId);
    Client.listen('Design: Loaded', saveDesignId);
    Client.listen('center changed', storeGMapCenter);

    function bootstrapSession (user_data) {
      /* jshint -W030 */
      user_data.session_id && (_ref_key = user_data.session_id); /* jshint +W030 */
      // make the ref
      if (_ref_key) {
        // load the state from the user's previous session
        _ref = new Firebase(sessions_url).child(_ref_key);
      } else {
        // there was no state, make a new one on the new session
        _ref = new Firebase(sessions_url).push();
        _ref.update({user_id: user_data.user_id});
        _ref.update({state:{stage: 0, step: 0}});
      }
      // bootstrapStreams();
      fb_observable = _ref.observe('value');
      state_stream = _ref.child('state').observe('value');
      _ref.once('value', loadSession );
    }

    function loadSession (ds){
      var data = ds.exportVal();
      data.session_id = _ref.key();
      console.log('data in loadSession', data);
      if (data.form_id) {
        // update form's _ref_key
        FormProvider.setRefKey(data.form_id);
      }
      if (data.design_id) {
        console.log('design_id on session', data.design_id);
        DesignProvider.setRefKey(data.design_id);
      }
      if (data.map_center) {
        console.log('map_center on session', data.map_center);
        DesignProvider.setCenter(data.map_center);
      }
      return Client.emit('Session: Loaded', data);
    }

    function restartSession () {
      var state_obj = {stage: 0, step: 0};
      _ref.child('state').set(state_obj);
    }

    function saveFormId (data) {
      _ref.update({form_id: data.form_id});
    }
    function saveDesignId (data) {
      _ref.update({design_id: data.design_id});
    }

    function storeGMapCenter (location) {
      if (location.lat()) { // TODO: make this work for Gmap & Configurator
        _ref.child('map_center').update([ location.lat(), location.lng(), ]);
      } else {
        alert('unhandled center changed event');
      }
    }

    function awesome_session_builder_brah () {
      return {
        // TODO: enable hotswap sessions
        // setRefKey: function (key){
        //   console.log('Session.setRefKey method called', key)
        //   key && (_ref_key = key);
        // },
        setUserKey: function (key){
          /* jshint -W030 */
          key && (_user_key = key);
          /* jshint +W030 */
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
