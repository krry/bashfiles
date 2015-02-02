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
    console.log('design provider started');
  this.$get = [ "Clientstream", function designProviderFactory(Client) {
    console.log('design $get');

    var feature;

    var design_ref = new Firebase('https://scty.firebaseio.com/designs/').push();
    var fb_observable = design_ref.observe('value').skip(1);
    var areas_ref;
    var areas_stream;

    areas_ref = design_ref.child('areas');
    areas_stream = areas_ref.observe('value').skip(1);

    // HACK: sync service probably isn't necessary
    Client.listen('session key', function (key){return design_ref.update({session: key});});
    Client.emit('design key', design_ref.key());
    // TODO: it's possible pass arguments to this $get method to change the fb_observable's_ref
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
  } ];
}
