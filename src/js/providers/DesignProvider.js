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

  var rx_areas = new Rx.Subject();

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
    this.map_details.center = center;
  }

  this.$get = [ "Session", "Clientstream", function designProviderFactory(Session, Client) {

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
    Client.listen('Session: Loaded', bootstrapDesign);

    function bootstrapDesign (ds) {
          _ref = _ref_key ? new Firebase(designs_url).child(_ref_key) : new Firebase(designs_url).push();
    }

    // load design & notify app design is loaded
    function loadDesign (ds) {

    }

    _ref.child('areas/0').on('value', function (ds) {
      rx_areas.onNext(ds.exportVal());
    })


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




    // watch the area_collection to validate trace_complete
    var _wkt;
    function awesome_design_builder_brah() {
      return {
        // dev
        rx_areas: rx_areas,
        // dev end
        map_details: {
          center: map_center,
        },
        areas_collection: new ol.Collection(),
        draw_source:      new ol.source.Vector(),
        modify_source:    new ol.source.Vector(),
        rx_center:        rx_center,
        rx_zoom:          rx_zoom,
        rx_areas:         rx_areas,
        // rx_areas_source:  rx_areas_source,
        setWkt: function name(txt) {
          _wkt = txt
        },
        getWkt: function () {
          return _wkt
        },
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
