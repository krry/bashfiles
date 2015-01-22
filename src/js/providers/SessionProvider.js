providers.provider("Session", SessionProvider_);

function SessionProvider_ () {
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

  var session_ref = new Firebase('https://scty.firebaseio.com/sessions/').push();  // TODO: pass arguments to this $get method to change the fb_observable's_ref
  var fb_observable = session_ref.observe('value').skip(1);
  var state_stream = session_ref.child('state').observe('value').skip(2);
  this.$get = [  "JwtService", "Clientstream", function SessionProviderFactory(jwt, Client) {
    console.log('Session Provider started')
    /* setup listeners */

    // listen for and save successful auth to the session when you get it
    Client.listen('new user', function (data) {
      // save data to session object
    });

    // if user is existing, should send existing users to their correct place in the flow
    Client.listen('existing user', function() {
      // get necessary data to move the user to correct state in flow
    });

    // listen for & save form_id to the session when you get it
    Client.listen('form key', function (data) {
      console.log('heard that form key: ', data);
      return session_ref.update({ form: data });
    });

    // listen for & save design_id to the session when you get it
    Client.listen('design key', function (data) {
      console.log('heard that design key: ', data);
      return session_ref.update({ design: data });
    });

    /*  initialize the process of getting auth from firebase with custom token */
    jwt.jwt();

    function awesome_design_builder_brah () {
      return {
        ref:    function (){ return session_ref; },
        id:     function (){ return session_ref.key(); },
        stream: function (){ return fb_observable; },
        state_stream: function (){ return state_stream; },
        next:   function () { Client.emit('stage', "next");},
        back:   function () { Client.emit('stage', "back");},
      };
    }

    // always save your firebase references when you create them
    return new awesome_design_builder_brah();
  } ];
}
