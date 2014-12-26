providers.provider('Session', SessionProvider_);
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


  var session_ref = new Firebase('https://scty.firebaseio.com/states/1234/state');  // TODO: pass arguments to this $get method to change the fb_observable's_ref
  var fb_observable = session_ref.observe('value');

  this.$get = [  "JwtService", function SessionProviderFactory(jwt) {

    // auth with firebase
    jwt.jwt();

    function awesome_design_builder_brah() {
      return {
        ref:    function(){return session_ref},
        id:     function(){return session_ref.id()},
        stream: function(){return fb_observable},
      }
    }

    // always save your firebase references when you create them
    return new awesome_design_builder_brah();
  } ];
