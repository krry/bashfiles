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
    // disabling jshint warning for this magical piece of codez from Firebase
    /* jshint -W030 */
    limit && (ref = ref.limit(limit));
    /* jshint +W030 */
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
}]).service('addWkt', ['$firebase', 'firebaseRef', function ($firebase) {
  /**
   * @function
   * @name setWkt
   * @param {String}
   * @return a Firebase Obj
   */
  return function addWkt (design_areas_ref, wkt_txt) {
    var wkt_ref = design_areas_ref.push(wkt_txt);
    return wkt_ref;
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
