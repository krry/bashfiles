// Configurator View
/*
 * this is the Configurator for the map.
 * name: Configurator
 *

    inject it as you deem necessary... necessarily.
 *
 */

angular.module('flannel').factory("View", ['Design', View_]);

function View_(Design) {

  var view = new ol.View({
    center: Design.temp_center,
    projection: 'EPSG:4326',
    maxZoom: 20, // don't zoom further than google can zoom
  });

  console.debug('Design.temp_center', Design.temp_center);

  view.rx_center = new Rx.Observable.fromEventPattern(
    function addHandler(h) {
      console.debug('add handler center', h);
      return view.on('change:center', h);
    },
    function delHandler (h) {
      return view.off('change:center', h);
    }
  );

  view.rx_zoom   = new Rx.Observable.fromEventPattern(
    function addHandler(h) {
      return view.on('change:resolution', h);
    },
    function delHandler (h) {
      return view.off('change:resolution', h);
    }
  );
  
  return view
}
