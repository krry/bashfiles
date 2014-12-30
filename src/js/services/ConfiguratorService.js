/**
 * this is an object
 * name: fln_area
 *
 *Ï
 */

providers.provider("Configurator", ConfiguratorFactory_);

function ConfiguratorFactory_() {

  this.$get = ["Session", "StyleService", "LayerService", function (Session, Styles, Layers) {

    var map,
        view,
        layers,
        features,
        draw,
        modify,
        dragpan_opt;

    // defaults
    var default_controls = ol.control.defaults({
      zoom: true,
      attribution: false,
      rotate: false,
    });
    var dragpan_opt = {enableKinetic: true};
    // For a map to render, a view, one or more layers, and a target container are needed
    var feature_overlay = new ol.FeatureOverlay({
      style: Styles.defaultStyleFunction,
      features: new ol.Collection([]),
    })

    var view = Layers.initOlView(); // TODO: move in to this provider

    var target // This is set by flnOlMap directive link
    function setElement(target_element) {
      console.log(target_element)
      configurator_options.target = target_element;
    }

    var configurator_options = {
      controls: ol.control.defaults(default_controls),
      view: view,
      target: null,
      interactions: [],
      layers: [Layers.staticmap],
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
    });
    // convenience for enable/disable
    var interactions = {
      draw: draw,
      modify: modify,
      dragpan: new ol.interaction.DragPan(dragpan_opt),
    }
    function ConfiguratorBuilder() {
      Layers.drawn_features = feature_overlay.getFeatures(); // hack: this shouldn't be assigned this way

      return {
        map: function(target){
          setElement(target);
          return map || (map = new ol.Map(configurator_options));
        },
        view: function(){ return view;},
        draw: function(){ return draw;},
        enable: function (name) { map.addInteraction(interactions[name]);},
        disable: function (name) { map.removeInteraction(interactions[name]);},
        // features: 'butts',
      }
    }

    return new ConfiguratorBuilder()
  }]

}


// olMapOptions = {
//       controls: ol.control.defaults({
//             zoom: true,
//             attribution: false,
//             rotate: false,
//           }),
//       view: LayerService.initOlView(),
//       interactions: [],
//       // layers: LayerService.init(target_element),
//       // overlays: [new ol.FeatureOverlay({
//       //         style: StyleService.defaultStyleFunction,
//       //         name: 'area_layer',
//       //       })],
//       target: target_element,
//     }

// var raster = new ol.layer.Tile({
//   source: new ol.source.MapQuest({layer: 'sat'})
// });

// var map = new ol.Map({
//   layers: [raster],
//   target: 'map',
//   view: new ol.View({
//     center: [-11000000, 4600000],
//     zoom: 4
//   })
// });

// // The features are not added to a regular vector layer/source,
// // but to a feature overlay which holds a collection of features.
// // This collection is passed to the modify and also the draw
// // interaction, so that both can add or modify features.
// var featureOverlay = new ol.FeatureOverlay({
//   style: new ol.style.Style({
//     fill: new ol.style.Fill({
//       color: 'rgba(255, 255, 255, 0.2)'
//     }),
//     stroke: new ol.style.Stroke({
//       color: '#ffcc33',
//       width: 2
//     }),
//     image: new ol.style.Circle({
//       radius: 7,
//       fill: new ol.style.Fill({
//         color: '#ffcc33'
//       })
//     })
//   })
// });
// featureOverlay.setMap(map);

// var modify = new ol.interaction.Modify({
//   features: featureOverlay.getFeatures(),
//   // the SHIFT key must be pressed to delete vertices, so
//   // that new vertices can be drawn at the same position
//   // of existing vertices
//   deleteCondition: function(event) {
//     return ol.events.condition.shiftKeyOnly(event) &&
//         ol.events.condition.singleClick(event);
//   }
// });
// map.addInteraction(modify);

// var draw; // global so we can remove it later
// function addInteraction() {
//   draw = new ol.interaction.Draw({
//     features: featureOverlay.getFeatures(),
//     type: /** @type {ol.geom.GeometryType} */ (typeSelect.value)
//   });
//   map.addInteraction(draw);
// }

// var typeSelect = document.getElementById('type');


// /**
//  * Let user change the geometry type.
//  * @param {Event} e Change event.
//  */
// typeSelect.onchange = function(e) {
//   map.removeInteraction(draw);
//   addInteraction();
// };

// addInteraction();
