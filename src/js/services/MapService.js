/* ==================================================

  MapService

  this factory produces maps, layers, collections

  Google Map objects on `service.g.foo`
  OpenLayer Map objects on `service.o.bar`

  OL Map options are set in these objects:
    _ol_control_defaults
    _ol_map_interaction_defaults

================================================== */

angular.module('flannel').factory('MapService', ['$q', 'Clientstream', 'StyleService', MapService_]);

function MapService_ ($q, Client, StyleService) {

  var service = {
    // the open layers map object
    o: {},
    // ol map methods
    addOverlay: addOverlay,
    getOmap: getOmap,
    setRoofmap: setRoofmap,
    getRoofmap: getRoofmap,
    getOmapCenter: getOmapCenter
  };

  // HACK: when the gmap center updates store it here so Configurator and OlMapCtrl can grab it as needed
  // the omap center get and set functions are also hacky
  Client.listen('center changed', setOmapCenter);

  function getOmapCenter () {
    return service.omapCenter;
  }

  function setOmapCenter (location) {
    console.log('setting center of OlMap at:', location);
    service.omapCenter = location;
    // view.setCenter([location.lat(), location.lng()]);
    // if (location !== Gmap.map.getCenter()){
    // }
  }

  function getOmap(options) {  //TODO: move to OlService
    return service.o.omap;
  }

  function getRoofmap() {  //TODO: move to OlService
    return service.o.roofmap;
  }
  function setRoofmap (options) {  //TODO: move to OlService
    service.o.roofmap = new ol.Map(options);
    return service.o.roofmap;
  }

  function addOverlay(layer) {    //TODO: move to OlService
    return service.o.omap.addOverlay(layer);
  }

  return service;
}
