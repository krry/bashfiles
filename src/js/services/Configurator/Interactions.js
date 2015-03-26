// Configurator Interactions
/*
 *
 *
 *
 *
 */

angular.module('flannel').factory('Interactions', ['Design', 'StyleService', 'AreaService', Interactions_]);

function Interactions_(Design, Styles, AreaService) {
    // returned by Factory
  var interactions,
    // interactions
      draw,
      modify,
      zoom,
      dragpan,
    // defaults
      dragpan_opt;


  interactions = {};
  interactions.collection = new ol.Collection();
  interactions.controls   = new ol.Collection();

  dragpan_opt = { enableKinetic: true };
  interactions.current = null;
  // dragpan
  interactions.dragpan = new ol.interaction.DragPan(dragpan_opt);
  // mousewheel zoom
  interactions.zoom    = new ol.interaction.MouseWheelZoom();
  // draw areas
  interactions.draw = new ol.interaction.Draw({
    // features: Design.areas_collection,
    type: 'Polygon',
    geometryName: 'area',
  });

  // get the feature, and pass it along on the wire
  interactions.draw.on('drawend', function(e){
    var feature = e.feature;
    // DEV: TODO: because we don't remove the original feature, we don't have a
    // way to track the event of removing a polygon. instead the app thinks we just
    // change the existing polygon to a new polygon.
    Design.ref().child('areas').child('0').set({ // HACK: one area only
      wkt: AreaService.getWkt(feature),
    })
  });

  // modify
  var modify_overlay = new ol.FeatureOverlay({
    features: Design.areas_collection,
    style:    Styles.highlightStyleFunction,
  })
  interactions.modify_overlay = modify_overlay;
  interactions.modify = new ol.interaction.Modify({
    // features: Design.areas_collection,
    features: modify_overlay.getFeatures(),
    style: Styles.highlightStyleFunction,

    // the SHIFT key must be pressed to delete vertices, so
    // that new vertices can be drawn at the same position
    // of existing vertices
    deleteCondition: function(event) {
      return ol.events.condition.shiftKeyOnly(event) &&
          ol.events.condition.singleClick(event);
    }
  });

  interactions.modify.clearArea = function () {
    Design.rx_areas.onNext("remove by client");
  }

  return interactions;
}
