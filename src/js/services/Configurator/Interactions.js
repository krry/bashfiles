// Configurator Interactions
/*
 *
 *
 *
 *
 */

angular.module('flannel').factory('Interactions', ['Design', 'StyleService', Interactions_]);

function Interactions_(Design, Styles) {
      // returned by Factory
    var interactions,
      // interactions
        draw,
        modify,
        zoom,
        dragpan,
      // defaults
        dragpan_opt;

    interactions = new ol.Collection();
    dragpan_opt = { enableKinetic: true };

    // dragpan
    interactions.dragpan = new ol.interaction.DragPan(dragpan_opt);
    // mousewheel zoom
    interactions.zoom    = new ol.interaction.MouseWheelZoom();
    // draw areas
    interactions.draw = new ol.interaction.Draw({
      source: Design.area_source,
      features: Design.areas_collection,
      type: 'Polygon',
      geometryName: 'area',
    });
    // modify
    interactions.modify = new ol.interaction.Modify({
      features: Design.areas_collection,
      style: Styles.highlightStyleFunction,
      // the SHIFT key must be pressed to delete vertices, so
      // that new vertices can be drawn at the same position
      // of existing vertices
      deleteCondition: function(event) {
        return ol.events.condition.shiftKeyOnly(event) &&
            ol.events.condition.singleClick(event);
      }
    });
    interactions.modify.getFeatureFromDraw = function (f_id) {
      f_id = f_id || 0;
      if (Design.area_source.getFeatures() === []) {
        console.alert('you need to have a feature for modify to work on a feature');
      }
      Design.areas_collection.push(Design.area_source.getFeatures()[f_id]);
    }
    interactions.modify.clearFeaturesFromModify = function() {
      Design.areas_collection.clear();
    }

  return interactions;
}
