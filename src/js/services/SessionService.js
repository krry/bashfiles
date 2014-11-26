/* ==================================================
  SessionService.

================================================== */
function SessionService_ ($firebase, SyncService) {

  var service = {
    setUser: setUser,
    currentUser: currentUser,
  };

  // remove from firebase after remove from map
  function setUser(user) {
  }

  // update ref on client modify
  function currentUser() {
  }

  return service;
}

angular.module('flannel').service('SessionService',[SessionService_()]);
