/* ==================================================
  Synchronization Service
  this provides the object of record for all interactions between
  the application and Firebase.

  Every firebase object should be set on this service.

================================================== */
function SyncService_ ($firebase) {

  var service = {
    get: get
  };

  function get (name) {
    if (name === 'all') return sync;
    return sync[name];
  }

  return service;
}

angular.module('flannel').factory('SyncService',['$firebase', SyncService_]);
