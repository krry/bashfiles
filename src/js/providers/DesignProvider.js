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
      rx_zoom,
      rx_selectedpeak;

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
    // center: null,
    // zoom_level: 18
  }
  this.setCenter = function(center) {
    this.map_details.center = center;
  }

    var rx_center = new Rx.Subject();
    var rx_zoom = new Rx.Subject();
    var rx_areas = new Rx.Subject();
    var rx_selectedpeak = new Rx.BehaviorSubject();

  this.$get = [ "Session", "Clientstream", "StyleService", function designProviderFactory(Session, Client, Styles) {



    Client.listen('Design: Loaded', saveDesignIdToSession);

    // always ask the session for value, to enable direct state navigation
    if (Session.ref()) {
      Session.ref().once('value', bootstrapDesign);
    } else {
      console.debug('**** Design: waiting for Session');
      Client.listen('Session: Loaded', function(){
        return Session.ref().once('value', bootstrapDesign);
      });
    }

    rx_center.subscribe(subSessionMapCenterToDesignMapCenter);

    function subSessionMapCenterToDesignMapCenter(c) {
      if (c === null || c.lat === 0) return;
      Session.ref() && Session.ref().update(c);
    }

    function bootstrapDesign (data) {
      var data = data.exportVal()
      data.design_id && (_ref_key = data.design_id);
      _ref = _ref_key ?
        // use the one you're given in config
        new Firebase(designs_url).child(_ref_key) :
        // or get a new one.
        new Firebase(designs_url).push();
      _ref.once('value', loadDesign);
    }

    // load design & notify app design is loaded
    function loadDesign (ds) {
      _ref.child('areas/0').on('value', function (ds) {
        rx_areas.onNext(ds.exportVal());
      });

      _ref.child('areas/0/ridge').on('value', function (ds){
        rx_selectedpeak.onNext(ds.exportVal());
      });

      _ref.child('map_details/center').on('value', function (ds) {
        rx_center.onNext(ds.exportVal());
      });

      _ref.child('map_details/zoom_level').on('value', function (ds){
        rx_zoom.onNext(ds.exportVal());
      });


      var data = ds.exportVal() || {};
      data.design_id = _ref.key();
      Client.emit('Design: Loaded', data);
    }

    function saveDesignIdToSession(d) {
      Session.ref().update({design_id: d.design_id});
    }

    function awesome_design_builder_brah() {
      return {
        map_details: {
          center: map_center,
        },
        areas_collection: new ol.Collection(),
        modify_collection: new ol.Collection(),
        // sources
        draw_source:      new ol.source.Vector(),
        modify_source:    new ol.source.Vector(),
        roofpeak_source:  new ol.source.Vector(),
        // overlays
        modify_overlay:   new ol.FeatureOverlay({style: Styles.highlightStyleFunction}),
        // streams
        rx_center:        rx_center,
        rx_zoom:          rx_zoom,
        rx_areas:         rx_areas,
        rx_selectedpeak:  rx_selectedpeak,
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
