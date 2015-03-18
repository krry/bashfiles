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

(function () {
  Rx.Observable.$watch = function (scope, watchExpression, objectEquality) {
    return Rx.Observable.create(function (observer) {
      // Create function to handle old and new Value
      function listener (newValue, oldValue) {
        observer.onNext({ oldValue: oldValue, newValue: newValue });
      }
      // Returns function which disconnects the $watch expression
      return scope.$watch(watchExpression, listener, objectEquality);
    });
  };
})();

/** Usage: per https://xgrommx.github.io/rx-book/content/how_do_it/angular_with_rxjs.html#integration-with-scopes
*  // Get the scope from somewhere
*  var scope = $rootScope;
*  scope.name = 'Reactive Extensions';
*  scope.isLoading = false;
*  scope.data = [];
*  // Watch for name change and throttle it for 1 second and then query a service
*  Rx.Observable.$watch(scope, 'name')
*      .throttle(1000)
*      .map(function (e) {
*          return e.newValue;
*      })
*      .do(function () {
*          // Set loading and reset data
*          scope.isLoading = true;
*          scope.data = [];
*      })
*      .flatMapLatest(querySomeService)
*      .subscribe(function (data) {
*          // Set the data
*          scope.isLoading = false;
*          scope.data = data;
*      });
*
*/

/** https://github.com/Reactive-Extensions/RxJS/blob/master/doc/howdoi/eventemitter.md
* Custom Event Emitter
*
*/
var hasOwnProperty = {}.hasOwnProperty;

function Emitter() {
  this.subjects = {};
}

Emitter.prototype.emit = function (name, data) {
  var fnName = createName(name);
  this.subjects[fnName] || (this.subjects[fnName] = new Rx.Subject());
  this.subjects[fnName].onNext(data);
}

Emitter.prototype.listen = function (name, handler) {
  var fnName = createName(name);
  this.subjects[fnName] || (this.subjects[fnName] = new Rx.Subject());
  return this.subjects[fnName].subscribe(handler);
}

Emitter.prototype.dispose = function () {
  var subjects = this.subjects;
  for (var prop in subjects) {
    if (hasOwnProp.call(subjects, prop)) {
      subjects[prop].dispose();
    }
  }
  this.subjects = {};
}



