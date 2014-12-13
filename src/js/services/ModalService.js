angular.module('flannel').factory('ModalService', [ModalService_]);

function ModalService_ () {

  var shown = false;
  var dialogs = {};

  var service = {
    get:         get,
    set:         set,
    activate:    activate,
    dialogShown: dialogShown,
  };

  return service;

  function get() {
    return shown;
  }

  function set(value) {
    shown = value;
    return shown;
  }

  function activate(name) {
    // set all values of keys in the object to false
    for (var key in dialogs) {
      if (dialogs.hasOwnProperty(key)) {
        dialogs[key] = false;
      }
    }
    // set the value of a key with that name to true
    dialogs[name] = true;
  }

  function dialogShown(name) {
    return dialogs[name];
  }
}

