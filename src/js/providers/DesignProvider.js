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

  // later, this will resolve for dependent parts
  var rx_design = new Rx.BehaviorSubject(null);
  var rxd = rx_design; // HACK: DEV: just for testing.

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

  rx_areas = new Rx.BehaviorSubject(null);
  rx_center = new Rx.BehaviorSubject(null);
  rx_zoom = new Rx.BehaviorSubject(null);
  rx_selectedpeak = new Rx.BehaviorSubject(null);

  _ref_key = null;

  designs_url = FIREBASE_URL + 'designs/';

  this.setRefKey = function(key){
    /* jshint -W030 */
    key && (_ref_key = key);
    /* jshint +W030 */
  };

  this.map_details = {};

  this.setCenter = function(center) {
    this.map_details.center = center;
  }

  this.$get = [ "$q", "Session", "Clientstream", "StyleService", function designProviderFactory($q, Session, Client, Styles) {
    // defer return of designstream until we're booted up.
    var rx_dfd = $q.defer();

    Client.listen('Design: Loaded', saveDesignIdToSession);
    Client.listen('Session: Loaded', function () {
      Session.rx_session().then(bootstrapDesign);
    })
    // always ask the session for value, to enable direct state navigation
    Session.rx_session().then(bootstrapDesign);
    function bootstrapDesign(rx_s){
      // get the subject's immediate value.
      var data = rx_s.value;

      data.design_id && (_ref_key = data.design_id);
      // get a firebase reference for the design
      _ref = _ref_key ?
        // use the one you're given in config
        new Firebase(designs_url).child(_ref_key) :
        // or get a new one.
        new Firebase(designs_url).push();
      // TODO: merge this .once() and the .on() subscriptions
      _ref.once('value', subscribeToDesignStreams);

      _ref.on('value', function (ds) {
        ds.exists() && rx_design.onNext(ds.exportVal());
        ds.exists() && rx_center.onNext(ds.exportVal().map_details.center);
        rx_dfd.resolve(rx_design);
      })

      // in case the session is restarted, restart the design, too.
      Client.listen('Session: Loaded', function(){
        return Session.ref().once('value', bootstrapDesign);
      });
    }

    // keep the Session Object's map center tied to the Design map center
    rx_center.subscribe(subSessionMapCenterToDesignMapCenter);
    function subSessionMapCenterToDesignMapCenter(c) {
      if (c === undefined) return;
      if (c === null || c.lat === 0) return;
      return Session.ref() && Session.ref().child('map_center').set(c);
    }

    // load design & notify app design is loaded
    function subscribeToDesignStreams (ds) {
      _ref.child('areas/0')               .on('value', subRxToAreas);
      _ref.child('areas/0/ridge')         .on('value', subRxToRidge);
      _ref.child('map_details/center')    .on('value', subRxToCenter);
      _ref.child('map_details/zoom_level').on('value', subRxToZoom);

      var data = ds.exportVal() || {};
      data.design_id = _ref.key();
      data.streams = {
        ridge: rx_selectedpeak,
        center: rx_center,
        zoom: rx_zoom,
        areas: rx_areas,
      }

      Client.emit('Design: Loaded', data);
    }
    function subRxToAreas(ds) {
        rx_areas.onNext(ds.exportVal());
      }
    function subRxToRidge(ds){
        rx_selectedpeak.onNext(ds.exportVal());
      }
    function subRxToCenter(ds) {
        rx_center.onNext(ds.exportVal());
      }
    function subRxToZoom(ds){
        rx_zoom.onNext(ds.exportVal());
      }
    function saveDesignIdToSession(d) {
      Session.ref().update({design_id: d.design_id});
    }

    function awesome_design_builder_brah() {
      var _wkt;
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
        rx_design: function () {
          return rx_dfd.promise;
        },
        getWkt: function () {
          return _wkt
        },
        ref:    function(key){
          if (key) {
            _ref_key = key;
            _ref = new Firebase(designs_url).child(_ref_key);
            _ref.once('value', subscribeToDesignStreams);
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
