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
  this.$get = [ "Session", function designProviderFactory(Session) {
    // HACK: sync service probably isn't necessary
    Session.ref().update({design:  design_ref.key()});
    design_ref.update({session: Session.ref().key()});
    areas_ref = design_ref.child('areas');
    areas_stream = areas_ref.observe('value').skip(1);
    var feature;
    function awesome_design_builder_brah() {
      return {
        stream: function(){return fb_observable},
        id:     function(){return design_ref.id()},
        ref:    function(){return design_ref},
        areas_ref: function(){ return areas_ref; },
        areas_stream: function() { return areas_stream;},
        feature:      function(arg) {
          if (arg) {
            feature = arg;
          }
          return feature;
        },
      }
    }

    // always save your firebase references when you create them
    return new awesome_design_builder_brah();
  } ]

  var design_ref = new Firebase('https://scty.firebaseio.com/designs/').push();
  var fb_observable = design_ref.observe('value').skip(1);
  var areas_ref;
  var areas_stream;

  // TODO: it's possible pass arguments to this $get method to change the fb_observable's_ref
}
