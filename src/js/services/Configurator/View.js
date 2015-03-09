// Configurator View
/*
 * this is the Configurator for the map.
 * name: Configurator
 *

    inject it as you deem necessary... necessarily.
 *
 */

angular.module('flannel').factory("View", View_);

function View_() {

  var extent = [0, 0, 1024, 968];
  var projection = new ol.proj.Projection({
    code: 'xkcd-image',
    units: 'pixels',
    extent: extent
  });

  var view = new ol.View({
    center: [0, 0],
    zoom: 1,
    projection: projection,
    center: ol.extent.getCenter(extent),
    maxZoom: 20, // don't zoom further than google can zoom
  });

  

  return view
}
