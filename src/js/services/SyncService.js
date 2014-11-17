/* ==================================================
  Synchronization Service
  this provides the object of record for all interactions between
  the application and Firebase.

  Every firebase object should be set on this service.

================================================== */
function SyncService_ ($scope, $firebase, syncData, firebaseRef) {

  var _sync = {
    area_count: 0,
    areas: {},
    designRef: null,
    designObj: null,
  };

  var service = {
    set: set,
    get: get,
    addAreaObj: addAreaObj,
    getAreaById: getAreaById,
    designObj: designObj,
    addSyncArea: addSyncArea,
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
    return _sync[name];
  }

  function set (key, val) {
    _sync[key] = val;
    return _sync[key];
  }

  function getAreaById (objId) {
    return _sync['areas'][objId]
  }

  function addSyncArea (area, id) {
    _sync.area_count++;
    _sync.areas[_sync.area_count] = area;
    return _sync.area_count;
  }

  return service;
}

angular.module('flannel').factory('SyncService',['$rootScope', '$firebase', 'syncData', 'firebaseRef', SyncService_]);
