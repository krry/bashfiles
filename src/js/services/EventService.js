/* ==================================================
  EventService
  this service contains event callbacks.

================================================== */
function EventService_ ($firebase, syncGeometry) {

  var service = {
    syncAfterDraw: syncAfterDraw,
  };
  var wkt = new ol.format.WKT();

  function syncAfterDraw (event) {
    var feature = event.feature || event.target;

    var drawnGeometry;
    var geometry;
    if (event.feature) { // you were passed a feature after draw
      geometry = feature.getGeometry();
      drawnGeometry = syncGeometry();
      drawnGeometry.text= wkt.writeFeature(feature)
      geometry.on('change', syncAfterDraw);
    } else {              // you were passed a modified geometry
      drawnGeometry = syncGeometry();
      feature.on('change', syncAfterDraw);
      drawnGeometry.text= wkt.writeGeometry(feature)
    }
    drawnGeometry.$save()
  };

  return service;
}

angular.module('flannel').factory('EventService',['$firebase', 'syncGeometry', EventService_]);
