// Configurator Interactions
/*
 *
 *
 *
 *
 */

angular.module('flannel').factory('Interactions', ['Design', 'Clientstream', 'StyleService', 'AreaService', Interactions_]);

function Interactions_(Design, Client, Styles, AreaService) {
    // returned by Factory
  var interactions = {},
    // interactions
      draw,
      modify,
      zoom,
      dragpan,
    // defaults
      dragpan_opt = { enableKinetic: true };

  // map subscribes to these collections to know what's
  interactions.collection = new ol.Collection();
  interactions.controls   = new ol.Collection();

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

  interactions.draw.on('drawend', function(e){
    // after user draws a shape, notify remote the feature is set.
    var feature = e.feature;
    Design.ref().child('areas').child('0').set({ // HACK: one area only
      wkt: AreaService.getWkt(feature),
    })
    Client.emit('Stages: stage', 'next')
  });

  interactions.draw.on('drawstart', function(e){
    // make sure that all modify shapes are eliminated
    Design.ref().child('areas').child('0').set(null);
  });

  // modify
  Design.modify_overlay.setFeatures(Design.modify_collection)
  interactions.modify_overlay = Design.modify_overlay;
  interactions.modify = new ol.interaction.Modify({
    features: Design.modify_collection,
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
