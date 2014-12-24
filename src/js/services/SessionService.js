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

  var session_ref = new Firebase('https://scty.firebaseio.com/states/1234/state');
  console.log("session_ref", session_ref)
  var fb_observable = session_ref.observe('value');

  // debugger;

  this.$get = [ "JwtService", "SyncService", function SessionProviderFactory(jwt, sync) { // TODO: provide auth object to this
    console.log('Session Provider Loads Here: *************************************************** ',arguments);
    // TODO: pass arguments to this $get method to change the fb_observable's_ref
    sync.set('session_ref', session_ref);
    return fb_observable
  } ]
}
