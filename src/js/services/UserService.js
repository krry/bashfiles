function UserService_ ($firebase, SyncService, firebaseRef) {
// function UserService_ ($firebase, SyncService, firebaseRef, design_ref) {
  /* ================================
    UserService



  ================================ */
  var service = {
    set_zip: set_zip,
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
  }

  function set_zip (zip) {
    user.zip = zip;
  }

  return service;
}

angular.module('flannel').factory('UserService', UserService_);
