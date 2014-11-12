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

 // a factory for sync'd geometry strings
 .factory('syncGeometry', ['$firebase', 'FBURL', function ($firebase, url) {

    var wkt = new ol.format.WKT();

    function syncGeometry (feature) {
      // create a reference to the WKT of the shape
      var geometry = wkt.writeFeature(feature)
      var ref = new Firebase(url + '/designId/geometries');
      // return it as a synchronized object
      return $firebase(ref).$push({area: geometry });
    }

    return syncGeometry;
  }]) 


 // a simple utility to create $firebase objects from angularFire
   .service('syncData', ['$firebase', 'firebaseRef', function($firebase, firebaseRef) {
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
   }]);

function pathRef(args) {
  for(var i=0; i < args.length; i++) {
    if( typeof(args[i]) === 'object' ) {
      args[i] = pathRef(args[i]);
    }
  }
  return args.join('/');
}
