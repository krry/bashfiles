/* ==================================================
  EventService
  this service contains event callbacks.

================================================== */
function EventService_ ($firebase, syncData) {

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
      drawnGeometry = syncData('/designId/geometries').$asObject();
      drawnGeometry.text= wkt.writeFeature(feature)
      geometry.on('change', syncAfterDraw);
    } else {              // you were passed a modified geometry
      drawnGeometry = syncData('/designId/geometries').$asObject();
      feature.on('change', syncAfterDraw);
      drawnGeometry.text= wkt.writeGeometry(feature)
    }
    drawnGeometry.$save()
  }

  function updateArea (event) {

  }

  return service;
}

angular.module('flannel').factory('EventService',['$firebase', 'syncData', EventService_]);
