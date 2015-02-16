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

angular.module('flannel').factory('InteractionService',['Configurator', InteractionService_]);

function InteractionService_ (Configurator) {
  var options,
      interactions;

  var snap_tolerance = 25;

  var service = {
    enable  : enable,
    disable : disable,
    get     : get,
    // init    : init,
  };

  function enable (interactions) {
    addInteractions(interactions);
  }

  function disable (interaction) {
    Configurator.map().removeInteraction(interaction);
  }

  function get (name) {
    if (!interactions) {
      init();
    }
    if (name === 'all') return interactions;
    return interactions[name];
  }

  function init() {
    return true;
  }


  function addInteractions(add){
    // wrap in array if it's not already
    add = typeof add === 'object' ? [add] : add;

    angular.forEach(add, function (interaction){
      Configurator.map().addInteraction(interaction);
    });
  }

  return service;
}
