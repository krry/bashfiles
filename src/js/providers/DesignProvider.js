providers.provider('Design', DesignProvider_);

function DesignProvider_ () {
  /* ================================
    Design
      structures the user flow, e.g.:

    designs: {
      design_id:{
        area: {
          <area_id>:     "polygon((blahblablhablh))",
          slope:        "10",
          obstructions: [{point},{point},{point}...]
        },
        map_details: {
          center: {lat,lng},
          zoom_level: {1},
        },
        owner:          "prospect_id",
        session:        "session_id",
        agent_history:  ["agent_id","agent_id","agent_id"]
      }
    }

    TODO:
      make a private history function that keeps a record of what you've done

  ================================ */

  /* helper functions TODO: service these
     wkt allows us to turn feature.getGeometry() into text, text into geometry for
     use with feature.setGeometry()
  */
  var wkt; // DEV: this is a helper that should be serviced

  wkt = new ol.format.WKT();
  function featFromTxt (wkt_txt, style_param) {
    var feature = wkt.readFeature(wkt_txt);
    var geometry = wkt.readGeometry(wkt_txt);
    feature.set(style_param, geometry);
    feature.setGeometryName(style_param);
    return feature;
  }
  /* end helpers */


  var _ref,
      _ref_key,
      _ref_stream,
      areas_ref,
      areas_stream,
      feature,
      areas_collection,
      map_center,
      center_ref,
      center_stream,
      designs_url;

  // design object in memory
  var design;

  draw_modify_collection = new ol.Collection();

  // streams
  var child_stream,
      streams;

  streams = {
    areas: {},
    panelfill: {},
    map: {},
  }


  _ref_key = null;
  designs_url = 'https://scty.firebaseio.com/designs/';

  this.setRefKey = function(key){
    /* jshint -W030 */
    key && (_ref_key = key);
    /* jshint +W030 */
  };

  this.setCenter = function(center) {
    map_center = center;
  }

  this.$get = [ "Session", "Clientstream", function designProviderFactory(Session, Client) {

    // always ask the session for value, to enable direct state navigation
    if (Session.ref()) {
      Session.ref().once('value', bootstrapDesign);
    } else {
      Client.listen('Session: Loaded', function(){
        console.log('loading design after session:')
        return Session.ref().once('value', bootstrapDesign);
      });
    }

    function bootstrapDesign (ds) {

      // center comes from Session object, which supports Proposal later
      center_ref = Session.ref().child('map_center');
      center_stream = center_ref.observe('value');
      var session_obj = ds.exportVal()
      map_center = session_obj.map_center; // TODO: get rid of this dependency

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
      _ref_stream = _ref.observe('value');
      // areas_stream
      areas_ref = _ref.child('areas');
      areas_stream = areas_ref.observe('value');
      // DEV: start
      // setup streams for the ref
      // watch for keys added to the _ref
      child_stream  = _ref.observe('child_added')
      // don't share similar data
      .distinctUntilChanged()
      .filter(_filter)
      // package the data for all subscribers
      .map(_map);
      // subscribe to stream for updates
      child_stream.subscribe(_ref_subscriber);
      // DEV: end
      return _ref;
    }

    // load design & notify app design is loaded
    function loadDesign (ds) {
      console.log('load design');
      var data = ds.exportVal() || {};
      _ref_key = ds.ref().key();
      data.design_id = _ref_key;
      data.map_center = map_center;
      console.log('mapcenter in Design load', data.map_center);
      Client.emit('Design: Loaded', data);
    }

    // watch the area_collection to validate trace_complete
    areas_collection = new ol.Collection();
    areas_collection.on('add',function(e){
      console.debug('add area -->',e.element);
    });
    areas_collection.on('change:length',function(e){
      Client.emit('area collection count', draw_source.getFeatures().length)
      console.debug('areacollection change:lenght -->', draw_source.getFeatures().length);
    });

    // stream functions
    // TODO: use filter if necessary, or remove
    function _filter(ds) {
      return true;
    }
    // map data to easier format
    function _map(c, p) {
      console.log('_map Design');
      var data      = {}
      data._ref_key = c.snapshot.key();
      data.data     = c.snapshot.exportVal();
      data.snapshot = c.snapshot;
      p && (data.prevname = p);
      return data
    }
    // subscribe to this ref
    function _ref_subscriber (d) {
      var child_ref_key = d._ref_key;
      if (child_ref_key === 'areas') {
        console.log('Design: stream areas')
        // setup areas streams
        streams.areas.add    = d.snapshot.ref().observe('child_added');
        streams.areas.remove = d.snapshot.ref().observe('child_removed');
        streams.areas.change = d.snapshot.ref().observe('child_changed');
        Client.emit('Design: stream areas', streams);
      } else if (child_ref_key === 'panelfill') {
        console.log('Design: stream panelfill')
        // setup panelfill stream
        streams.panelfill.add    = d.snapshot.ref().observe('child_added');
        streams.panelfill.remove = d.snapshot.ref().observe('child_removed');
        Client.emit('Design: stream panelfill', streams);
        streams.panelfill.change = d.snapshot.ref().observe('child_changed');
      } else if (child_ref_key === 'map_details') {
        // setup map_details stream
        console.log('Design: stream map_details')
        streams.map.center     = d.snapshot.ref().child('center')
          .observe('value')
          .distinctUntilChanged()
          .map(_map);
        streams.map.zoom_level = d.snapshot.ref().child('zoom')
          .observe('value')
          .distinctUntilChanged()
          .map(_map);
        Client.emit('Design: stream map_details', streams);

      } else {
        console.log('i don\'t know this refkey on design object', child_ref_key);
      }
    }

    function awesome_design_builder_brah() {
      return {
        map_details: {
          temp_center: [-122.39858709999999,  37.7618242],
          temp_zoom: 18,
        },
        areas_collection: areas_collection,
        draw_source:   new ol.source.Vector(),
        modify_source: new ol.source.Vector(),
        ref:    function(key){
          if (key) {
            _ref_key = key;
            _ref = new Firebase(designs_url).child(_ref_key);
            _ref.once('value', loadDesign);
          }
          return _ref;
        },
        stream: function(){return _ref_stream},
        id:     function(){return _ref.id()},
        areas_ref: function(){ return areas_ref; },
        areas_stream: function() { return areas_stream;},
        map_center: function (){ return map_center;},
        streams: function() {  return streams;  },
        center_stream: function () { return center_stream;},
        feature:      function(arg) {
          arg && (feature = arg);
          Client.emit('Design: target feature set', feature);
          return feature;
        },
      }
    }
    // always save your firebase references when you create them
    return new awesome_design_builder_brah();
  } ];
}
