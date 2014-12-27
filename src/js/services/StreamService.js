angular.module('flannel').service('StreamService', ["rx", StreamService_]);

function StreamService_ (Rx) {
  /* ================================
    StreamService

   Create an emitter to handle pub/sub.

  ================================ */

  var hasOwnProp = {}.hasOwnProperty;

  function createName (name) {
      return '$' + name;
  }

  function Emitter() {
      this.subjects = {};
  }

  Emitter.prototype.emit = function (name, data) {
      var fnName = createName(name);
      /* jshint -W030 */
      this.subjects[fnName] || (this.subjects[fnName] = new Rx.Subject());
      /* jshint +W030 */
      this.subjects[fnName].onNext(data);
  };

  Emitter.prototype.listen = function (name, handler) {
      var fnName = createName(name);
      /* jshint -W030 */
      this.subjects[fnName] || (this.subjects[fnName] = new Rx.Subject());
      /* jshint +W030 */
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

  return Emitter;
}
