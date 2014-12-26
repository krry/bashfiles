providers.provider('Design', DesignProvider_);
function DesignProvider_ () {
  /* ================================
    Design
      structures the user flow, e.g.:

    designs: {
      design_id:{
        area: {
          area_id:     "polygon((blahblablhablh))",
          slope:        "10",
          obstructions: [{point},{point},{point}...]
        },
        owner:          "prospect_id",
        session:        "session_id",
        agent_history:  ["agent_id","agent_id","agent_id"]
      }
    }

    TODO:
      make a private history function that keeps a record of what you've done

  ================================ */

  var design_ref = new Firebase('https://scty.firebaseio.com/designs/1234/design');
  var fb_observable = design_ref.observe('value');
  var areas_ref = design_ref.child('areas').push();

  // TODO: it's possible pass arguments to this $get method to change the fb_observable's_ref
  this.$get = [ "Session", function designProviderFactory(Session) {
    // HACK: sync service probably isn't necessary
    Session.ref().child('design').set(design_ref.parent().key());

    function awesome_design_builder_brah() {
      return {
        stream: function(){return fb_observable},
        id:     function(){return design_ref.id()},
        ref:    function(){return design_ref},
        areas_stream: function(arg) {
          (arg && areas_ref.set(arg))
          return areas_ref.observe();
        },
        areas_ref: function(){ return areas_ref; },
      }
    }

    // always save your firebase references when you create them
    return new awesome_design_builder_brah();
  } ]
}
