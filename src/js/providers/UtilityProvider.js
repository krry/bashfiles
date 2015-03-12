/* =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-

  Utility Provider

  accesses the utility API in SolarWorks

=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=- */

providers.provider('Utility', [UtilityProvider_ ]);

function UtilityProvider_ () {
  this.$get = ['$http', '$q', 'UTILITIES_API', function ($http, $q, UTILITIES_API) {

    function get (params) {

      var dfd = $q.defer();

      $http.get(UTILITIES_API, {
        params: params
      }).then(function (resp) {
        dfd.resolve(resp.data);
      }, function(resp) {
        dfd.reject(resp);
      });

      return dfd.promise;

    }

    return { get : get };

  }];
}
