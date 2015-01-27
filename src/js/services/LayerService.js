/* ==================================================
  LayerService
  this service provides tools get layers from the map

  show(layer_array) - show a layer, or array of layers
  hide(layer_array) - hide a layer, or array of layers
  get([name])       - get a layer object by name, or an object with all layers
  pixelProjection   - pixel projection

================================================== */
angular.module('flannel').factory('LayerService', ['$window', 'StyleService', LayerService_]);

function LayerService_ ($window, StyleService) {
  var extent,
      pixelProjection,
      service,
      REMOVEMEcenter,
      sources,
      layers,
      drawLayer;

  REMOVEMEcenter = new google.maps.LatLng(37.4834436, -122.267538);

  service = {

    // show          : show,
    // hide          : hide,
    getLayer      : getLayer,
    initOlView    : initOlView,
    getProjection : getProjection,
    getDrawLayer  : getDrawLayer,

    // DEV:

    staticmap: new ol.layer.Image({source:new ol.source.ImageStatic({
        // TODO: URL constructor for this
        url: 'http://scexchange.solarcity.com/scfilefactory/TestGrab.aspx?format=jpg&center='+ REMOVEMEcenter.lat()+','+ REMOVEMEcenter.lng() +'&zoom=20&size='+ 2048 +'x'+ 2048 +'&maptype=satellite&scale=1&client=gme-solarcity',
        imageSize: [2048, 2048],
        // projection: pixelProjection, // needed later for converting sizes
        imageExtent: [0,0,2048,2048],
        visible: true,
      })})
    // ENDDEV:
  };

  // TODO: size map according to the div in which it is loaded, then resize when that div changes size
  // HACK:   dev related
  // TODO:  Extent relates to the size of the map on the user's screen.
  //     *** It's used to convert positions of clicks to positions on a real map. ***
  //         It should update as the screen is resized
  //         In EDLTR, it was always fullscreen.

  REMOVEMEcenter = new google.maps.LatLng(37.4834436, -122.267538);

  function getDrawLayer () {
    // !drawLayer && (drawLayer = )
    console.log('getDrawLayer', drawLayer);
    return drawLayer
  }

  function getProjection () {
    return pixelProjection;
  }

  function initOlView (){
    return new ol.View({
      center: [REMOVEMEcenter.lat(), REMOVEMEcenter.lng()],
      zoom: 4
    })
  }


  function getLayer (name) {
    if (name === 'all') return layers;
    return layers[name];
  }

  return service;
}
