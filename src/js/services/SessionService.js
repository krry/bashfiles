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
// <<<<<<< HEAD
  var fb_observable = session_ref.observe('value');

  // TODO: pass arguments to this $get method to change the fb_observable's_ref
  // this.$get = [ "JwtService", "SyncService", function SessionProviderFactory(jwt, sync) { // TODO: provide auth object to this
  //   // always save your firebase references when you create them
  //   // HACK: sync service probably isn't necessary
  //   sync.set('session_ref', session_ref);
  //   return fb_observable
  // } ]

  this.$get = [  "JwtService", "SyncService", function SessionProviderFactory(jwt, sync) {

    // auth with firebase
    jwt.jwt();

    // HACK: sync service probably isn't necessary
    sync.set('session_ref', session_ref);

    function awesome_design_builder_brah() {
      return {
        stream: function(){return fb_observable},
        ref:    function(){return session_ref},
      }
    }

    // always save your firebase references when you create them
    return new awesome_design_builder_brah();
  } ]


// =======
//   console.log("session_ref", session_ref)
//   var fb_observable = session_ref.observe('value');

//   // debugger;

//   this.$get = [ "JwtService", "SyncService", function SessionProviderFactory(jwt, sync) { // TODO: provide auth object to this
//     console.log('Session Provider Loads Here: *************************************************** ',arguments);
//     jwt.jwt();
//     // TODO: pass arguments to this $get method to change the fb_observable's_ref
//     sync.set('session_ref', session_ref);
//     return fb_observable
//   } ]
// >>>>>>> feature/firebase_rx
}
