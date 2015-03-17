/* =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-

  Ahj Provider

  Accesses the nearby HOAs in the Ahj app

=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=- */

providers.provider('Ahj', [AhjProvider_ ]);

function AhjProvider_ () {
  this.$get = ['$http', '$q', 'AHJ_API', function($http, $q, AHJ_API) {
    function get(params) {
      var dfd = $q.defer();

      $http.get(AHJ_API, { 
        params: {
          type_name: params.type_name || 'HOA',
          distance: params.distance || 10,
          latitude: params.latitude,
          longitude: params.longitude
        }
      }).then(function(resp) {
        dfd.resolve(resp.data);
      }, function(resp) {
        dfd.reject(resp);
      });

      return dfd.promise;
    }

    return {
      get: get
    };
  }];
}
