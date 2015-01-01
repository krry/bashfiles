/**
 * this is the Configurator for the map.
 * name: Configurator
 *

    inject it as you deem necessary... necessarily.
 *
 */

providers.provider("Configurator", ConfiguratorFactory_);

function ConfiguratorFactory_() {

  this.$get = ["$window", "Session", "StyleService", "LayerService", function ($window, Session, Styles, Layers) {

    var map,
        REMOVEMEcenter,
        layers,
        features,
        draw,
        modify,
        dragpan_opt,
        default_controls,
        interactions,
        windowWidth,
        windowHeight,
        draw_modify_features,
        feature_overlay,
        pixelProjection,
        target, // This is set by flnOlMap directive link
        view;

    windowWidth = $window.innerWidth;
    windowHeight = $window.innerHeight;
    REMOVEMEcenter = new google.maps.LatLng(37.4834436, -122.267538); // hack:

    // defaults
    default_controls = ol.control.defaults({
      zoom: false,
      attribution: false,
      rotate: false,
    });
    dragpan_opt = { enableKinetic: true };

    // For a map to render, a view, one or more layers, and a target container are needed
    draw_modify_features = new ol.Collection([])
    feature_overlay = new ol.FeatureOverlay({
      style: Styles.defaultStyleFunction,
      features: draw_modify_features,
    })

    // what part of the map we see?
    view = new ol.View({
      center: [REMOVEMEcenter.lat(), REMOVEMEcenter.lng()],
      zoom: 18
    }); // TODO: move in to this provider

    // the DOM target, not the map center

    // the static map layer
    function setElement(target_element) {
      var el = (!target_element) ? $window : target_element;
      // var header = window.getComputedStyle(document.getElementById('header'), null);
      var el_height = $(el).innerHeight() - $('#header').height();
      var extent = [0, 0, $(el).innerWidth(), el_height];
      console.log('header height is:', $('#header').height());
      $('.fln-control-pan').css('height', el_height);
      setTimeout(function(){
        console.log('header height is:', $('#header').height());
      }, 1000);
      console.log('el_height is:', el_height);
      pixelProjection = new ol.proj.Projection({
        units: 'pixels',
        extent: extent
      });
      console.log('center!', view.getCenter())
      var layers = new ol.layer.Image({source:new ol.source.ImageStatic({
                url: [ // TODO: URL constructor for this
                  'http://scexchange.solarcity.com/scfilefactory/TestGrab.aspx?format=jpg&center=',
                  view.getCenter()[0]+','+ view.getCenter()[1],  //TODO: connect to the google map center here
                  '&zoom=20&size=',
                  windowWidth +'x'+ windowHeight,
                  '&maptype=satellite&scale=1&client=gme-solarcity'
                ].join(''),
                imageSize: [windowWidth, windowHeight],
                projection: pixelProjection, // needed later for converting sizes
                imageExtent: pixelProjection.getExtent(),
                visible: true,
              })})

      configurator_options.target = target_element[0]; // target_element comes from angular's link function.
      configurator_options.layers = [layers];
    }

    var configurator_options = {
      controls: ol.control.defaults(default_controls),
      view: view,
      target: null,
      interactions: [],
      layers: null,
      overlays: [feature_overlay],
    }

    // interactions
    modify = new ol.interaction.Modify({
      features: feature_overlay.getFeatures(),
      // the SHIFT key must be pressed to delete vertices, so
      // that new vertices can be drawn at the same position
      // of existing vertices
      deleteCondition: function(event) {
        return ol.events.condition.shiftKeyOnly(event) &&
            ol.events.condition.singleClick(event);
      }
    });

    draw = new ol.interaction.Draw({
      features: feature_overlay.getFeatures(),
      type: 'Polygon',
      geometryName: 'area',
    });
    // convenience for enable/disable

    interactions = {
      draw: draw,
      modify: modify,
      dragpan: new ol.interaction.DragPan(dragpan_opt),
      scroll_zoom: new ol.interaction.MouseWheelZoom(),
    }

    function ConfiguratorBuilder() {
      Layers.drawn_features = feature_overlay.getFeatures(); // hack: this shouldn't be assigned this way

      return {
        map: function(target){
          /* jshint -W030 */
          target && (setElement(target));
          /* jshint +W030 */
          return map || ( map = new ol.Map(configurator_options) );
        },
        view: function(){ return view; },
        draw: function(){ return draw; },
        modify: function(){ return modify; },
        features: function(){ return draw_modify_features.getArray(); },
        interactions: function(){ return interactions; },
        enable: function (name) { map.addInteraction(interactions[name]); },
        disable: function (name) { map.removeInteraction(interactions[name]); },

      }
    }

    return new ConfiguratorBuilder()
  }]

}
