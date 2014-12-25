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

  var design_ref = new Firebase('https://scty.firebaseio.com/designs/1234/design');
  var fb_observable = design_ref.observe('value');

  // TODO: it's possible pass arguments to this $get method to change the fb_observable's_ref
  this.$get = [ "SyncService", function designProviderFactory(sync) {
    // HACK: sync service probably isn't necessary
    sync.set('design_ref', design_ref);

    function awesome_design_builder_brah() {
      return {
        stream: function(){return fb_observable},
        ref:    function(){return design_ref},
      }
    }

    // always save your firebase references when you create them
    return new awesome_design_builder_brah();
  } ]



}
