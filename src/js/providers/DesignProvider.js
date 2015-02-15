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

  var _ref,
      _ref_key,
      _ref_stream,
      areas_ref,
      areas_stream,
      feature,
      map_center,
      center_stream,
      designs_url;

  _ref_key = null;
  designs_url = 'https://scty.firebaseio.com/designs/';

  this.setRefKey = function(key){
    /* jshint -W030 */
    key && (_ref_key = key);
    /* jshint +W030 */
  };

  this.setCenter = function(center) {
    console.log('set center in design provider', center);
    map_center = center;
  }

  this.$get = [ "Session", "Clientstream", function designProviderFactory(Session, Client) {

    // always ask the session for value, to enable direct state navigation
    Session.ref().once('value', bootstrapDesign);
    // center comes from Session object, which supports Proposal later
    center_ref = Session.ref().child('map_center');
    center_stream = center_ref.observe('value');

    function bootstrapDesign (ds) {
      var session_obj = ds.exportVal()
      map_center = session_obj.map_center;
      // make the ref when Design is first required.
      if (_ref_key) {
        // load the _ref from the user's previous session
        _ref = new Firebase(designs_url).child(_ref_key);
      } else {
        // there was no design yet, make a new one
        _ref = new Firebase(designs_url).push();
      }
      // firebase design ref
      _ref.once('value', loadDesign );
      _ref_stream = _ref.observe('value').skip(1);
      // areas_stream
      areas_ref = _ref.child('areas');
      areas_stream = areas_ref.observe('value').skip(1);
      // map_center stream from Session
      return _ref;
    }

    // load design & notify app design is loaded
    function loadDesign (ds) {
      var data = ds.exportVal() || {};
      _ref_key = ds.ref().key();
      data.design_id = ds.ref().key();
      // remap center to array format for configurator
      data.map_center = map_center;
      Client.emit('Design: Loaded', data);
    }

    function awesome_design_builder_brah() {
      return {
        ref:    function(key){
          if (key) {
            _ref_key = key;
            _ref = new Firebase(forms_url).child(_ref_key);
            _ref.once('value', processNewFormFromFirebase );
          }
          return _ref;
        },
        stream: function(){return _ref_stream},
        id:     function(){return _ref.id()},
        areas_ref: function(){ return areas_ref; },
        areas_stream: function() { return areas_stream;},
        center_stream: function () { return center_stream;},
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
