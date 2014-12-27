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
  this.$get = [  "JwtService", function SessionProviderFactory(jwt) {
    // auth with firebase
    jwt.jwt();

    function awesome_design_builder_brah() {
      return {
        ref:    function(){return session_ref},
        id:     function(){return session_ref.key()},
        stream: function(){return fb_observable},
        state_stream: function(){ return state_stream; },
      }
    }

    // always save your firebase references when you create them
    return new awesome_design_builder_brah();
  } ];
}
