providers.provider('Design', DesignProvider_);
function DesignProvider_ () {
  /* ================================
    Design
      structures the user flow, e.g.:

    designs: {
      design_id:{
        areas: {
          area_id: {
            geometry:     "polygon((blahblablhablh))",
            slope:        "10",
            obstructions: [{point},{point},{point}...]
          },
        },
        owner:          "prospect_id",
        session:        "session_id",
        agent_history:  ["agent_id","agent_id","agent_id",...]
      }
    }

    TODO:
      make a private history function that keeps a record of what you've done

  ================================ */

// HACK: bugfix:
  var design_ref = new Firebase('https://scty.firebaseio.com/designs/1234/design');
  var fb_observable = design_ref.observe('value');

  // TODO: pass arguments to this $get method to change the fb_observable's_ref
  this.$get = [ "SyncService", function designProviderFactory(sync) { // TODO: provide auth object to this
    // auth with firebase

    // always save your firebase references when you create them
    sync.set('design_ref', design_ref);
    return fb_observable
  } ]

  this.ref = function() {
    return design_ref;
  }
}
