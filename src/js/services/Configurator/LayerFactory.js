/* ==================================================

  This is the Configurator's Layers.

  static image
================================================== */
angular.module('flannel').factory('ConfiguratorLayer',['Clientstream', 'Design', ConfiguratorLayerFactory_]);

function ConfiguratorLayerFactory_ (Client, Design) {
  var service,
      static_map_layer,
      size,
      center,
      pixel_projection;

  var service = {
    staticMapLayer: staticMapLayer,
    layer: function() {return layer;},
  };

  function staticMapLayer (viewcenter, extent) {
    // get size from extent
    size = {};
    size.height = 2 * extent[3];
    size.width  = 2 * extent[2];

    // normalize mapcenter
    center = {};
    center.lat = viewcenter[0];
    center.lng = viewcenter[1];

    // set projection (used for converting pixel to lat-lng)
    pixel_projection = new ol.proj.Projection({
      units: 'pixels',
      extent: extent
    });

    static_image_source = new ol.source.ImageStatic({
        url: getGoogleStaticMapUrl(center, size),
        imageSize: [size.width, size.height],
        projection: pixel_projection, // needed later for converting sizes
        imageExtent: pixel_projection.getExtent(),
        visible: true,
      })

    static_map_layer = new ol.layer.Image({source: static_image_source});

    return static_map_layer;
  }

  function getGoogleStaticMapUrl (c, s) {
    var url = [
        'http://scexchange.solarcity.com/scfilefactory/TestGrab.aspx?format=jpg&center=',
        c.lat+','+ c.lng,
        '&zoom=20&size=',
        s.width +'x'+ s.height,
        '&maptype=satellite&scale=1&client=gme-solarcity'
      ].join('');
    // console.log('url', url);
    return url;
  }


  return service;
}
