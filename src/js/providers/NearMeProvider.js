/* =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-

  Near Me Provider

  Accesses the Near Me API in SolarWorks

=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=- */

providers.provider('NearMe', [NearMeProvider_ ]);

function NearMeProvider_ () {
  this.$get = ['$http', '$q', 'NEAR_ME_API', function($http, $q, NEAR_ME_API) {
    function get(params) {
      var dfd = $q.defer();

      $http.get(NEAR_ME_API, { params: params }).then(function(resp) {
        // Standardize the returned data
        dfd.resolve(resp.data.result);
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
