/* ================================
  UserService



================================ */

angular.module('flannel').factory('UserService', ["$firebase", "SyncService", "firebaseRef", UserService_]);

function UserService_ ($firebase, SyncService, firebaseRef) {

  var service = {
    getUser: get,
    setUser: set,
  };

  var user = {
    "zip": "",
    state: "",
    city: "",
    address: "",
    design_id: "",
    name: {
      first_name: "",
      last_name: ""
    },
    is_homeowner: null, // boolean
    phone: "",
    email: "",
    dob: {
      month: "",
      day: "",
      year: ""
    },
  };

  function get() {
    return user;
  }

  function set (key, value) {
    user['key'] = value;
  }

  return service;
}

