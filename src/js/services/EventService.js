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

  return service;
}

angular.module('flannel').factory('EventService',['$firebase', 'SyncService', EventService_]);
