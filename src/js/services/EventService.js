/* ==================================================
  EventService
  this service contains event callbacks.

================================================== */
function EventService_ ($firebase, SyncService) {

  var service = {
    modifyref: modifyref,
  };

  // remove from firebase after remove from map
  function removeArea (areaObj) {
    // remember to use firebase's unwatch() on any watched thing.
  }

  // update ref on client modify
  function modifyref (ref, newval) {
    // get syncObj from SyncService
    // make them changes
    ref.set(newval);
    // save changes to the obj
    return ref;
  }

  function syncAfterDraw (event) {
    var drawnGeometry,
        geometry,
        feature = event.feature || event.target;

    if (event.feature) { // you were passed a feature after draw
      geometry = feature.getGeometry();
      drawnGeometry = syncGeometry();
      drawnGeometry.text= wkt.writeFeature(feature);
      geometry.on('change', syncAfterDraw);
    } else {              // you were passed a modified geometry
      drawnGeometry = syncGeometry();
      feature.on('change', syncAfterDraw);
      drawnGeometry.text= wkt.writeGeometry(feature);
    }
    drawnGeometry.$save();
  }
  return service;
}

angular.module('flannel').factory('EventService',['$firebase', 'SyncService', EventService_]);
