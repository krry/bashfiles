/* ==================================================
  AuthenticationService.

================================================== */
function AuthenticationService_ (SessionService) {

  var service = {
    login: login,
    logout: logout,
  };

  // remove from firebase after remove from map
  function login (email, password) {
  }

  // update ref on client modify
  function logout () {
  }

  return service;
}

angular.module('flannel').service('AuthenticationService',['SessionService', AuthenticationService_(SessionService)]);
