/* =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-

  Configurator

  consumed by the OpenLayers map to enable configuration

=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=- */

providers.provider("Configurator", ConfiguratorFactory_);

function ConfiguratorFactory_() {

  var map,
      map_center,
      header,
      layers,
      features,
      draw,
      modify,
      dragpan_opt,
      default_controls,
      configurator_options,
      static_map_image_url,
      interactions,
      windowWidth,
      windowHeight,
      draw_modify_features,
      feature_overlay,
      pixel_projection,
      target, // This is set by flnOlMap directive link
      view;

  this.$get = ["$window", "StyleService", "Clientstream", "Design", function ($window, Styles, Client, Design) {

    // bootstrap configurator with details abt. design_stream, map_center, (// todo:) zoom_level
    Client.listen('Design: Loaded', bootstrapConfigurator);
    Client.listen('OlMap: map target element', setElement);

    // map event listeners
    Client.listen('erase area', area_pop);

    // defaults
    default_controls = ol.control.defaults({
      zoom: false,
      attribution: false,
      rotate: false,
    });
    dragpan_opt = { enableKinetic: true };

    function bootstrapConfigurator (design_obj) {
      /* For a map to render, a view, one or more layers, and a target container are needed */
      // TODO: use constrainCenter to prevent user dragging image off the page
      // what part of the map we see
      view = new ol.View({
                  center: [design_obj.map_center[0], design_obj.map_center[1]],
                  zoom: 18,
                  maxResolution: 1, // hack: hardcoding max zoom out
                  minResolution: 0.08, // hack: hardcoding max zoom in
      });

      // the group of features on the map
      draw_modify_features = new ol.Collection([]);
      feature_overlay = new ol.FeatureOverlay({
        style: Styles.defaultStyleFunction,
        features: draw_modify_features,
      })

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

      interactions = {
        draw: draw,
        modify: modify,
        dragpan: new ol.interaction.DragPan(dragpan_opt),
        scroll_zoom: new ol.interaction.MouseWheelZoom(),
      }

      Client.emit('Configurator: Loaded', interactions );
    }


    // finally, create the map & attach it to the DOM
    function setElement(target_element) {
      var el = (!target_element) ? $window : target_element;

      // var header = window.getComputedStyle(document.getElementById('header'), null);
      header = window.getComputedStyle(document.getElementById('header'), null);
      windowWidth = $window.innerWidth;
      windowHeight = $window.innerHeight - parseInt(header.getPropertyValue("height"));

      var el_height = $(el).innerHeight() - $('#header').height();
      var extent = [0, 0, $(el).innerWidth(), el_height];
      // console.log('header height is:', $('#header').height());
      $('.fln-control-pan').css('height', el_height);

      pixel_projection = new ol.proj.Projection({
        units: 'pixels',
        extent: extent
      });

      var imageWidth, imageHeight;
      imageHeight = 2 * extent[3];
      imageWidth = 2 * extent[2];

      static_map_image_url = [
            'http://scexchange.solarcity.com/scfilefactory/TestGrab.aspx?format=jpg&center=',
            view.getCenter()[0]+','+ view.getCenter()[1],
            '&zoom=20&size=',
            imageWidth +'x'+ imageHeight,
            '&maptype=satellite&scale=1&client=gme-solarcity'
          ].join('');

      // the static map layer
      var layers = new ol.layer.Image({
        source:  new ol.source.ImageStatic({
          url: static_map_image_url,
          imageSize: [imageWidth, imageHeight],
          projection: pixel_projection, // needed later for converting sizes
          imageExtent: pixel_projection.getExtent(),
          visible: true,
        }),
      })
      configurator_options = {
        controls: ol.control.defaults(default_controls),
        view: view,
        target: null,
        interactions: [],
        layers: null,
        overlays: [feature_overlay],
      }

      // make the static image center, the center of the view.
      view.setCenter(ol.extent.getCenter(pixel_projection.getExtent()));
      view.setZoom(1);
      // update configurator options
      configurator_options.layers = [layers];
      configurator_options.target = target_element[0];

      // let the app know that we got static tiles back
      // Client.emit('static tiles loaded', true);

      map = new ol.Map(configurator_options);
      Client.emit('Spinner: spin it', false);
      Client.emit('Configurator: Map ready', map);
    }


    function area_pop (data) {
      // erase the last area drawn on the map
      draw_modify_features.pop();
    }

    function ConfiguratorBuilder() {
      return {
        map: function ()  { return map; },
        view: function () { return view; },
        draw: function () { return draw; },
        modify: function () { return modify; },
        features: function () { return draw_modify_features.getArray(); },
        overlay: function () { return feature_overlay; },
        interactions: function () { return interactions; },
        enable: function (name) {
          if (map) {
            map.addInteraction(interactions[name]);
          } else {
            Client.listen('Configurator: Map ready', function() {
              return map.addInteraction(interactions[name]);
            });
          }
        },
        disable: function (name) { map.removeInteraction(interactions[name]); },
        setCenter: function (center) {
          console.log('*************** setCenter', center)
          map_center = center;
        },
      }
    }

    return new ConfiguratorBuilder()
  }]

}
