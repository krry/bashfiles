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
  var view, center_listner_key, zoom_listener_key;

  // todo: subscribe to design.mapcenter_stream

  var view = new ol.View({
    center: Design.map_details.temp_center,
    projection: 'EPSG:4326',
    minZoom: 18, // don't zoom out past the 'EPSG:4326' projection hahahaha
    maxZoom: 20, // don't zoom further than google can zoom // TODO: set this to the maxzoom at the current location
  });


  view.rx_center = new Rx.Observable.fromEventPattern(
    function addHandler(h) {
      center_listner_key = view.on('change:center', h);
      return center_listner_key;
    },
    function delHandler (h) {
      return view.unByKey(center_listner_key);
    }
  );

  view.rx_zoom   = new Rx.Observable.fromEventPattern(
    function addHandler(h) {
      zoom_listener_key = view.on('change:resolution', h);
      return zoom_listener_key;
    },
    function delHandler (h) {
      return view.unByKey(zoom_listener_key);
    }
  );

  return view
}
