/* ==================================================
  EventService
  this service contains event callbacks.

================================================== */
function EventService_ ($firebase, SyncService) {

  var service = {
    syncModifyDown: syncModifyDown,
    wktModifyUp: wktModifyUp,
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
    return ref
  }

  // update area on firebase modify
  function syncModifyDown (areaObj, newString) {
    // https://www.firebase.com/docs/web/libraries/angular/api.html#angularfire-firebaseobject-watch-callback-context
    console.log(shapestring);
  }

  return service;
}

angular.module('flannel').factory('EventService',['$firebase', 'SyncService', EventService_]);


    // var geom = new ol.Object({geom: drawnGeometry});



// modifyDown
    // var drawnGeometry = SyncService.get('area')[0]
    // // var drawnGeometry = SyncService.get('area1');
    // var geom = wkt.readGeometry(drawnGeometry.featureText);
    // // SyncService.get('features').push(feature);
    // feature.setGeometry(geom);
    // // feature.on('change', updateArea);
