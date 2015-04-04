/* ========================================================

   CLIENTSTREAM

   provides an emitter to handle pub/sub within the app

   This stream is used throughout the app by:
   * controllers
   * providers
   * services

======================================================== */

providers.provider('Clientstream', [Clientstream_]);

function Clientstream_ () {
  this.$get = [function ClientStreamProviderFactory () {

    function buts () {
      return client_stream
    }
    return buts()
  }];

  var Stream = Emitter();
  var hasOwnProp = {}.hasOwnProperty;
  var loggins = "kenny";

  function createName (name) {
      return '$' + name;
  }

  function Emitter() {
      this.subjects = {};
  }

  function logStream (action, name, data) {
    if (loggins === "kenny") {
      if (typeof data !== "undefined") {
        console.debug('~~stream~~', action, '==>', name, data);
      } else {
        var msg = ['~~stream~~', action, '<==', name].join(' ');
        console.count(msg);
      }
    }
  }

  Emitter.prototype.emit = function (name, data) {
      var fnName = createName(name);
      this.subjects[fnName] || (this.subjects[fnName] = new Rx.Subject());
      logStream("emit", name, data);
      this.subjects[fnName].onNext(data);
  };

  Emitter.prototype.listen = function (name, handler) {
      var fnName = createName(name);
      this.subjects[fnName] || (this.subjects[fnName] = new Rx.Subject());
      logStream("listen", name);
      return this.subjects[fnName].subscribe(handler);
  };

  Emitter.prototype.dispose = function () {
      var subjects = this.subjects;
      for (var prop in subjects) {
          if (hasOwnProp.call(subjects, prop)) {
              subjects[prop].dispose();
          }
      }

      this.subjects = {};
  };

  var client_stream = new Emitter();
}
