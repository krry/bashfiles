providers.provider('Design', ['FIREBASE_URL', DesignProvider_]);

function DesignProvider_ (FIREBASE_URL) {
  /* ================================
    Design
      structures the user flow, e.g.:

    designs:{
      design_id: {
        areas: {
          area_id: {
            wkt:  "polygon((blahblablhablh))",
          }
          slope:        "10",
          obstructions: "[{point},{point},{point}...]"
        },
        map_details: {
          center: [-122.39858709999999,  37.7618242],
          zoom_level: 18,
        },
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
      feature_stream,
      areas_collection,
      map_center,
      center_ref,
      designs_url;

  // design object in memory
  var design,
      area_wkts;

  // later this becomes [wktstring, wktstring] where array[area_id] === wktstring
  area_wkts = null;

  // streams
  var child_stream,
      streams,
      rx_areas,
      rx_center,
      rx_zoom;

  streams = {
    areas: {},
    panelfill: {},
    map: {},
  }

  _ref_key = null;

  designs_url = FIREBASE_URL + 'designs/';

  this.setRefKey = function(key){
    /* jshint -W030 */
    key && (_ref_key = key);
    /* jshint +W030 */
  };
  this.map_details = {
    center: [0,1],
    zoom_level: 18
  }
  this.setCenter = function(center) {
    debugger;
    // what's calling this setCenter? SessionProvider_
    this.map_details.center = center;
  }

  this.$get = [ "Session", "Clientstream", function designProviderFactory(Session, Client) {

    _ref = _ref_key ? new Firebase(designs_url).child(_ref_key) : new Firebase(designs_url).push();

    rx_center     = _ref.child('map_details/center')
      .observe('value')
      .distinctUntilChanged()

    rx_center
      .filter(function (ds) {
        if (!map_center) return true; // design loading for first time on this client
        if (map_center !== ds.exportVal()) return true; // remote update
        console.error('you have weird remote center on design_ref');
      })
      .map(function function_name(ds) {
        return ds.exportVal();
      });

    rx_zoom       = _ref.child('map_details/zoom_level')
      .observe('value')
      .distinctUntilChanged()

    var observable = new Rx.Observable.fromEventPattern(
      function add(h) {
        _ref.child('areas').on('value', h)
      },
      function remove(h) {
        _ref.child('areas').off('value', h)
      }
    )

    var rx_areas_source = Rx.Observer.create(function (x) {
      return x;
    })

    rx_areas = Rx.Subject.create(rx_areas_source, observable);
    rx_areas
      .map(function (ds) {
        if (ds.exportVal() === null) return ;
        var id, wkt;0
        console.log('mapping observer', ds.exportVal());
        if (!area_wkts) { // area_wkts null during startup


          area_wkts = [];
          return null
        } else if (area_wkts && ds.exportVal() === null) {
          // area_wkts set & there's a value on the object
          console.debug('mapping remove by remote', ds.exportVal());

          return "remove by remote"
        } else  {
        console.debug('mapping', {
          id: ds.ref().key(),
          wkt: ds.exportVal().wkt
        });

          return {
            id: ds.ref().key(),
            wkt: ds.exportVal().wkt
          }
        }
      })
      .filter(function (areas_obj) {
        if (!areas_obj) return false; // filter when we have a new design
        console.debug('filter not false')
        return true                   // otherwise, pass it along as is
      })


    .subscribe(function (areas_obj) {
      console.log('subscriber', areas_obj.exportVal())
      if (areas_obj === "remove by remote") {
        area_wkts[areas_obj.id] = null;
      } else if (areas_obj === "remove by client") {
        _ref
          .child('areas')
          .child(0) // HACK: only works for one roof area
          .set(null);
      } else {
        // set local, used by filter
        area_wkts = [];

        area_wkts[areas_obj.id] = areas_obj.wkt;
        // update remote
        _ref
          .child('areas')
          .child(areas_obj.id)
          .set(areas_obj.wkt);
      }
    });

    console.log(rx_areas);

/////////

    // always ask the session for value, to enable direct state navigation
    // if (Session.ref()) {
    //   Session.ref().once('value', bootstrapDesign);
    // } else {
    //   console.debug('**** Design: waiting for Session');
    //   Client.listen('Session: Loaded', function(){
    //     console.log('loading design after session:')
    //     return Session.ref().once('value', bootstrapDesign);
    //   });
    // }

    function bootstrapDesign (ds) {

      // center comes from Session object, which supports Proposal later
      center_ref = Session.ref().child('map_center');
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
      // setup map_details stream
      rx_center     = _ref.child('center')
        .observe('value')
        .distinctUntilChanged();
      rx_zoom       = _ref.child('zoom')
        .observe('value')
        .distinctUntilChanged();
      // watch for keys added to the _ref
      // setup streams for the ref
      child_stream  = _ref.observe('child_added')
      // don't share similar data
      .distinctUntilChanged()
      .filter(_filter)
      // package the data for all subscribers
      // .map(_map);
      // subscribe to stream for updates
      child_stream.subscribe(_ref_subscriber);
      // DEV: end
      return _ref;
    }

    // load design & notify app design is loaded
    function loadDesign (ds) {
    //   console.log('load design');
    //   var data = ds.exportVal() || {};
    //   _ref_key = ds.ref().key();
    //   data.design_id = _ref_key;
    //   // data.map_center = map_center;
    //   console.log('data in Design load', data);
    //   // Client.emit('Design: Loaded', data);
    }

    // watch the area_collection to validate trace_complete


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
        // streams.areas.add    = d.snapshot.ref().observe('child_added');
        // streams.areas.remove = d.snapshot.ref().observe('child_removed');
        // streams.areas.change = d.snapshot.ref().observe('child_changed');
        Client.emit('Design: stream areas', streams);
      } else if (child_ref_key === 'panel_fill') {
        console.log('Design: stream panelfill')
        // setup panelfill stream
        // streams.panelfill.add    = d.snapshot.ref().observe('child_added');
        // streams.panelfill.remove = d.snapshot.ref().observe('child_removed');
        // Client.emit('Design: stream panelfill', streams);
        // streams.panelfill.change = d.snapshot.ref().observe('child_changed');
      } else if (child_ref_key === 'map_details') {
        // don't worry about this here.
        console.log('Design: stream map_details');
        Client.emit('Design: stream map_details', {rx_zoom: rx_zoom, rx_center: rx_center});

      } else {
        console.log('i don\'t know this refkey on design object', child_ref_key);
      }
    }

    function awesome_design_builder_brah() {
      return {
        map_details: {
          center: map_center,
        },
        areas_collection: areas_collection,
        draw_source:      new ol.source.Vector(),
        modify_source:    new ol.source.Vector(),
        rx_center:        rx_center,
        rx_zoom:          rx_zoom,
        rx_areas:         rx_areas,
        rx_areas_source:  rx_areas_source,
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
