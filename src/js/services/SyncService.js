/* ==================================================
  Synchronization Service
  this provides the object of record for all interactions between
  the application and Firebase.

  Every firebase object should be set on this service.

================================================== */
function SyncService_ ($firebase) {

  var _sync = {};
  _sync.applicationState = $firebase

  var service = {
    get: get
  };

  function get (name) {
    if (name === 'all') return _sync;
    return _sync[name];
  }



  return service;
}

angular.module('flannel').factory('SyncService',['$firebase', SyncService_]);
