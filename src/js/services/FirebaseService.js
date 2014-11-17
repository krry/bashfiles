angular.module('flannel.firebase', [])
// a simple utility to create references to Firebase paths
.factory('firebaseRef', ['$firebase', 'FBURL', function ($firebase, FBURL) {
  /**
   * @function
   * @name firebaseRef
   * @param {String|Array...} path
   * @return a Firebase instance
   */
  return function(path) {
    return new Firebase(pathRef([FBURL].concat(Array.prototype.slice.call(arguments))));
  }
}])
// a simple utility to create $firebase objects from angularFire
.service('syncData', ['$firebase', 'firebaseRef', function ($firebase, firebaseRef) {
  /**
   * @function
   * @name syncData
   * @param {String|Array...} path
   * @param {int} [limit]
   * @return a Firebase instance
   */
  return function syncData(path, limit) {
    var ref = firebaseRef(path);
    limit && (ref = ref.limit(limit));
    return $firebase(ref);
  }
}])
.service('updateArea', ['$firebase', 'firebaseRef', function ($firebase) {
  /**
   * @function
   * @name setWkt
   * @param {String}
   * @return a Firebase Obj
   */
  return function updateArea (ref, newVal) {
    var val = ref.update(newval);
    return val;
  }
}]).service('addArea', ['$firebase', 'firebaseRef', function ($firebase) {
  /**
   * @function
   * @name setWkt
   * @param {String}
   * @return a Firebase Obj
   */
  return function addArea (ref, id) {
    var wkt = ref.push(id);
    return wkt;
  }
}]);

function pathRef(args) {
  for(var i=0; i < args.length; i++) {
    if( typeof(args[i]) === 'object' ) {
      args[i] = pathRef(args[i]);
    }
  }
  return args.join('/');
}
