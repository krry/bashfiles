/* ==================================================

  MapService

  this factory produces maps, layers, collections

  Google Map objects on `service.g.foo`
  OpenLayer Map objects on `service.o.bar`

  OL Map options are set in these objects:
    _ol_control_defaults
    _ol_map_interaction_defaults

================================================== */

angular.module('flannel').factory('MapService', ['$q', 'Clientstream', 'LayerService', 'StyleService', 'Configurator', MapService_]);

function MapService_ ($q, Client, LayerService, StyleService, Configurator) {

  var service = {
    // the open layers map object
    o: {},
    // ol map methods
    initOmap: initOmap,
    addOverlay: addOverlay,
    getOmap: getOmap,
    setOmap: setOmap,
    setRoofmap: setRoofmap,
    getRoofmap: getRoofmap,
  };

  return service;

  function initOmap(target_element) {
    var olMapOptions = {
      controls: ol.control.defaults({
            zoom: true,
            attribution: false,
            rotate: false,
          }),
      view: LayerService.initOlView(),
      // interactions: ol.interaction.defaults,
      // layers: LayerService.init(target_element),
      // overlays: [new ol.FeatureOverlay({
      //         style: StyleService.defaultStyleFunction,
      //         name: 'area_layer',
      //       })],
      target: target_element,
    };

    return setOmap(Configurator.map(target_element));
    // return setOmap(olMapOptions);
  }

  function getOmap(options) {  //TODO: move to OlService
    return service.o.omap;
  }
  function setOmap (options) {  //TODO: move to OlService
    service.o.omap = new ol.Map(options);

    // LayerService.getDrawLayer().setMap(service.o.omap);
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
}
