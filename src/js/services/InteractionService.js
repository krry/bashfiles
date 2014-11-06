/* ==================================================
  InteractionService
  this service provides tools to change interactions available on the map

  enable([interactions])  - enable  an interaction, or array of interactions
  disable([interactions]) - disable an interaction, or array of interactions
  get(name | all)         - return the interaction by name

  Also, this file includes some default setting variables:
    * DRAW_SNAP_TOLERANCE is the snap to distance during
      draw events in px

================================================== */
function InteractionService_ (MapService, StyleService, LayerService) {

  var snap_tolerance = 25;

  var service = {
    enable   : enable,
    disable  : disable,
    get      : get,
  };

  function enable (interactions) {
    var curr = MapService.getOmap().getInteractions().getArray();
    addAndRemoveInteractions(interactions, curr);
  }

  function disable (interaction) {
    MapService.getOmap().removeInteraction(interaction);
  }
  
  function get (name) {
    if (name === 'all') return interactions;
    return interactions[name];
  }

  // interaction options //
  var options = {
    draw: {
      source: LayerService.get('area').getSource(), // destination for new features
      snapTolerance: snap_tolerance,                // snap tolerance
      type: 'Polygon',                              // target geometry
      geometryName: 'area',                         // name used for getting the correct style
      style: StyleService.defaultStyleFunction,     // styleFunction returns styles
    },
    select: {
      layers: [LayerService.get('area')],           // what layers can you select?
      style: StyleService.highlightStyleFunction,   // style function for selected features
    },
    modify: {
      style: StyleService.highlightStyleFunction,
    },
    dragpan: {
      kinetic: null,
    }
  };
  
  /* Interactions */
  var interactions    = {};
  interactions.draw   = new ol.interaction.Draw(options.draw);
  interactions.select = new ol.interaction.Select(options.select);
  // hack: how else can i get the Collection of the Select interaction?
  options.modify.features = interactions.select.getFeatures();
  interactions.modify = new ol.interaction.Modify(options.modify);
  interactions.dragpan = new ol.interaction.DragPan(options.dragpan);
  
  function addAndRemoveInteractions(add, remove){
    // clear any selected features to prevent bugs
    interactions.select.getFeatures().clear();
    // wrap in array if it's not already
    add = typeof add === 'object' ? [add] : add;
    // remove current interactions
    angular.forEach(remove, function (interaction) {
      MapService.getOmap().removeInteraction(interaction);
    });
    angular.forEach(add, function (interaction){
      MapService.getOmap().addInteraction(interaction);
    });
  }

  return service
}

angular.module('flannel').factory('InteractionService',['MapService', 'StyleService', 'LayerService', InteractionService_]);
