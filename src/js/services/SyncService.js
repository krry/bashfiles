/* ==================================================
  Synchronization Service
  this provides the object of record for all interactions between
  the application and Firebase.

  Every firebase object should be set on this service.

================================================== */

function SyncService_ ($scope, $firebase, syncData, firebaseRef) {

  var _sync = {
    user: {},
    area_count: 0,
    areas: {},
    designRef: null,
    designObj: null,
  };

  var service = {
    set: set,
    get: get,
    designObj: designObj,
    getSyncRef: getSyncRef,
    addSyncRef: addSyncRef,
  };

  function designObj (key) {
    if (_sync.designObj) {return _sync.designObj;}
    else {
      _sync.designObj = syncData('/designs/'+ key);
      return _sync.designObj;
    }
  }

  function designRef() {
    return _sync.designRef;
  }

  function get (name) {
    if (name === 'all') return _sync;
    return _sync[name] ;
  }

  function set (key, val) {
    _sync[key] = val;
    return _sync[key];
  }

  function getSyncRef (obj_type, ref_id) {
    return _sync[obj_type][ref_id];
  }

  function addSyncRef (obj_type, ref) {
    _sync[obj_type][ref.key()] = ref;
    return _sync[obj_type][ref.key()];
  }

  return service;
}

angular.module('flannel').factory('SyncService',['$rootScope', '$firebase', 'syncData', 'firebaseRef', SyncService_]);
