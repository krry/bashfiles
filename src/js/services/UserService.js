/* ================================
  UserService



================================ */

angular.module('flannel').factory('UserService', ["$firebase", "SyncService", "firebaseRef", UserService_]);

function UserService_ ($firebase, SyncService, firebaseRef) {

  var service,
      home,
      prospect;

  service = {
    getHome: getHome,
    setHome: setHome,
    getProspect: getProspect,
    setProspect: setProspect,
  };

  home = {
    owner_id: "",
    "zip": "",
    state: "",
    city: "",
    address: "",
    // design_id: "",
    // is_homeowner: null, // boolean
    // phone: "",
    // email: "",
    // dob: {
      // month: "",
      // day: "",
      // year: ""
    // },
  };

  prospect = {
    name: {
      first_name: "",
      last_name: "",
    },
    email: "",
    phone: "",
    designs: [],
    homes: [],
    calls: [],
  };

  function getHome() {
    return home;
  }

  function setHome (key, value) {
    home[key] = value;
    return home[key];
  }

  function getProspect() {
    return prospect;
  }

  function setProspect (key, value) {
    prospect[key] = value;
    return prospect[key];
  }

  return service;
}

