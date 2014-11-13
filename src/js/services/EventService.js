/* ==================================================
  EventService
  this service contains event callbacks.

================================================== */
function EventService_ ($firebase, SyncService) {

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
      drawnGeometry = SyncService.sync('geometry','/designId/geometries');
      drawnGeometry.text= wkt.writeFeature(feature)
      geometry.on('change', syncAfterDraw);
    } else {              // you were passed a modified geometry
      drawnGeometry = SyncService.sync('geometry','/designId/geometries');
      feature.on('change', syncAfterDraw);
      drawnGeometry.text= wkt.writeGeometry(feature)
    }
    drawnGeometry.$save()
  }

  function updateArea (event) {

  }

  return service;
}

angular.module('flannel').factory('EventService',['$firebase', 'SyncService', EventService_]);
