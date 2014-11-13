/* ==================================================
  Synchronization Service
  this provides the object of record for all interactions between
  the application and Firebase.

  Every firebase object should be set on this service.

================================================== */
function SyncService_ ($firebase, syncData) {

  var _sync = {};
  _sync.applicationState = $firebase

  var service = {
    get:  get,
    sync: sync,
  };

  function get (name) {
    if (name === 'all') return _sync;
    return _sync[name];
  }

  function sync (name, urlPath) {
    _sync[name] = syncData(urlPath).$asObject();
    return _sync[name];
  }

  return service;
}

angular.module('flannel').factory('SyncService',['$firebase', 'syncData', SyncService_]);
