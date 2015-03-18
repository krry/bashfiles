// Configurator Interactions
/*
 *
 *
 *
 *
 */

angular.module('flannel').factory('Interactions', ['Design', 'Layers', 'StyleService', 'AreaService', Interactions_]);

function Interactions_(Design, Layers, Styles, AreaService) {
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

  interactions = {};
  dragpan_opt = { enableKinetic: true };
  interactions.current = null;
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

  // get the feature, and pass it along on the wire

  console.log('Design.rx_areas.onNext', Design.rx_areas.onNext)
  interactions.draw.on('drawend', function(e){
    var feature = e.feature;
    debugger;
    Design.rx_areas_source.onNext({
      id: '0', //HACK: hardcode for single roof area
      wkt: AreaService.getWkt(feature),
    })
  });

  // modify
  interactions.modify = new ol.interaction.Modify({
    features: Layers.area_collection,
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
    Design.rx_area.onNext("remove by client");
  }

  return interactions;
}
