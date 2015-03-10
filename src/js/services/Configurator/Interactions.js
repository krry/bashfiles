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
        dragpan_opt,
      // feature being modified
        modify_target_feature;

    interactions = new ol.Collection();
    dragpan_opt = { enableKinetic: true };

    // dragpan
    interactions.dragpan = new ol.interaction.DragPan(dragpan_opt);
    // mousewheel zoom
    interactions.zoom    = new ol.interaction.MouseWheelZoom();
    // draw areas
    interactions.draw = new ol.interaction.Draw({
      source: Design.draw_source,
      type: 'Polygon',
      geometryName: 'area',
    });

    // add to the collection of features that can be modified
    interactions.draw.on('drawend', function(e){
      Design.areas_collection.push(e.feature);
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
      if (Design.draw_source.getFeatures() === []) {
        return console.alert('you need to have a feature for modify to work on a feature');
      }
      // get the feature we want to adjust
      modify_target_feature = Design.draw_source.getFeatures()[f_id];
      // move the feature to the properly styled layer
      Design.draw_source.removeFeature(modify_target_feature);
      Design.modify_source.addFeature(modify_target_feature);
    }
    interactions.modify.clearFeaturesFromModify = function() {
      // get the last feature in the modify collection
      var f = modify_source.getFeatures()[0];
      // move the feature back to the draw styled layer
      Design.modify_source.removeFeature(f);
      Design.draw_source.addFeature(f);
    }

  return interactions;
}
