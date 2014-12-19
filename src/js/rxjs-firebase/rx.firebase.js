(function () {
  var makeCallback = function(eventType, observer) {
    if (eventType === 'value') {
      return function(snap) {
        observer.onNext(snap);
      };
    } else {
      return function(snap, prevName) {
        // Wrap into an object, since we can only pass one argument through.
        observer.onNext({snapshot: snap, prevName: prevName});
      }
    }
  };

  Firebase.prototype.__proto__.observe = function(eventType) {
    var query = this;
    return Rx.Observable.create(function(observer) {
      var listener = query.on(eventType, makeCallback(eventType, observer), function(error) {
        observer.onError(error);
      });
      return function() {
        query.off(eventType, listener);
      }
    }).publish().refCount();
  };
})();

/**
 * fork: https://gist.github.com/lazaruslarue/bc5e64252c7b6d205ab3
 *
 * Usage:
 * var source = new Firebase("https://<your firebase>.firebaseio.com").observe('<event type>');
 * console.log(source instanceof Rx.Observable);
 * source.subscribe(function(changeData) {
 *   // If event type is 'value', changeData is a DataSnapshot
 *   // Otherwise, changeData is {snapshot: DataSnapshot, prevName: optional string of previous child location}
 * });
 *
 */
