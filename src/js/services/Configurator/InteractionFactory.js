/* ==================================================

  This is the Configurator's Interactions & Feature Collection

  interactions:
    draw -> deposits drawn features to a collection
    modify -> targets the ol.FeatureOverlay
    scroll_zoom -> enable mousewheel zoom
    drag_pan -> drag the map to move its center

  vector sources:
    roof_areas -> used to
    panel_fill -> collection of features from the panelfill



================================================== */
angular.module('flannel').factory('ConfiguratorInteraction',['Design', ConfiguratorInteractionFactory_]);

function ConfiguratorInteractionFactory_ (Design) {
  var service,
      // interactions
      draw,
      modify,
      dragpan,
      scroll_zoom,
      // options
      dragpan_opt,
      // collection of features being modified
      modify_coll,
      // sources
      panel_fill,


  // defaults
  dragpan_opt = { enableKinetic: true };

  // collection of roof mounting planes
  roof_areas = new ol.Collection()


  // first step interactions
  draw = new ol.interaction.Draw({
    features:     Design.draw_modify_collection(),
    type:         'Polygon',
    geometryName: 'area',
  });

  dragpan = new ol.interaction.DragPan(dragpan_opt);

  scroll_zoom = new ol.interaction.MouseWheelZoom();

  // second step interaction
  modify = new ol.interaction.Modify({
    features: Design.draw_modify_collection(),
    // the SHIFT key must be pressed to delete vertices, so
    // that new vertices can be drawn at the same position
    // of existing vertices
    deleteCondition: function(event) {
      return ol.events.condition.shiftKeyOnly(event) &&
        ol.events.condition.singleClick(event);
    }
  });

  interactions = {
    draw: draw,
    modify: modify,
    dragpan: dragpan,
    scroll_zoom: scroll_zoom,
  }

  return {
    interactions: function() { return interactions; },
  };
}
