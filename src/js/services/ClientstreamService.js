providers.provider('Clientstream', Clientstream_);
function Clientstream_ () {
  /* ================================
    Clientstream

   Create an emitter to handle pub/sub.

  ================================ */
  this.$get = [function ClientStreamProviderFactory () {

    function buts () {
      return client_stream
    }
    return buts()
  }];

  var Stream = Emitter();
  var hasOwnProp = {}.hasOwnProperty;

  function createName (name) {
      return '$' + name;
  }

  function Emitter() {
      this.subjects = {};
  }

  Emitter.prototype.emit = function (name, data) {
      var fnName = createName(name);
      this.subjects[fnName] || (this.subjects[fnName] = new Rx.Subject());
      this.subjects[fnName].onNext(data);
  };

  Emitter.prototype.listen = function (name, handler) {
      var fnName = createName(name);
      this.subjects[fnName] || (this.subjects[fnName] = new Rx.Subject());
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
