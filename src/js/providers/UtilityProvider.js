/* =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-

  Utility Provider

  Accesses the utility API in SolarWorks

=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=- */

providers.provider('Utility', [UtilityProvider_ ]);

function UtilityProvider_ () {
  this.$get = ['$http', '$q', 'UTILITIES_API', 'RATES_API', function($http, $q, UTILITIES_API, RATES_API) {
    function search(params) {
      var dfd = $q.defer();
      
      $http.get(UTILITIES_API, { 
        params: params
      }).then(function(resp) {
        dfd.resolve(resp.data);
      }, function(resp) {
        dfd.reject(resp);
      });

      return dfd.promise;
    }

    function get(params) {
      var dfd = $q.defer();

      $http.get(RATES_API, { 
        params: params
      }).then(function(resp) {
        dfd.resolve(resp.data);
      }, function(resp) {
        dfd.reject(resp);
      });

      return dfd.promise;
    }

    return {
      search: search,
      get: get
    };
  }];
}
