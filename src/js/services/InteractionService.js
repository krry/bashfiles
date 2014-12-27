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

angular.module('flannel').factory('InteractionService',['MapService', 'StyleService', 'LayerService', 'EventService', InteractionService_]);

function InteractionService_ (MapService, StyleService, LayerService, EventService) {

  var options,
      interactions;

  var snap_tolerance = 25;

  var service = {
    enable  : enable,
    disable : disable,
    get     : get,
    init    : init,
  };

  function enable (interactions) {
    addInteractions(interactions);
  }

  function disable (interaction) {
    MapService.getOmap().removeInteraction(interaction);
  }

  function get (name) {
    if (!interactions) {
      init();
    }
    if (name === 'all') return interactions;
    return interactions[name];
  }

  function init(){
    // interaction options //
    options = {
      draw: {
        source: LayerService.getLayer('area').getSource(), // destination for new features
        snapTolerance: snap_tolerance,                // snap tolerance
        type: 'Polygon',                              // target geometry
        geometryName: 'area',                         // name used for getting the correct style
        style: StyleService.defaultStyleFunction,     // styleFunction returns styles
      },
      select: {
        layers: [LayerService.getLayer('area')],           // what layers can you select?
        style: StyleService.highlightStyleFunction,   // style function for selected features
      },
      modify: {
        style: StyleService.highlightStyleFunction,
        features: new ol.Collection([]),
      },
      dragpan: {
        enableKinetic: true,
      }
    };

    interactions = {
      draw: new ol.interaction.Draw(options.draw),
      select: new ol.interaction.Select(options.select),
      dragpan: new ol.interaction.DragPan(options.dragpan),
      modify: new ol.interaction.Modify(options.modify), // (jesse) HACK: with more than one area, this doesn't work well
    };

    // options.modify.features = interactions.select.getFeatures();    // (Jesse) HACK: don't need to do this for one area
    // interactions.modify = new ol.interaction.Modify(options.modify);// see above line
    // this is suitable for only one area
    interactions.draw.on('drawend', function saveDrawn (event) {
      var feature = event.feature;
      options.modify.features.push(feature);
    });
  }

  function addInteractions(add){
    // wrap in array if it's not already
    add = typeof add === 'object' ? [add] : add;

    angular.forEach(add, function (interaction){
      MapService.getOmap().addInteraction(interaction);
    });
  }

  return service;
}
