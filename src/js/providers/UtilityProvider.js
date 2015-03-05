/* =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-

  Utility Provider

  accesses the utility API in SolarWorks

=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=- */

providers.provider('Utility', [UtilityProvider_ ]);

function UtilityProvider_ () {
  this.$get = ['$http', '$q', 'UTILITIES_API', 'RATES_API', function($http, $q, UTILITIES_API, RATES_API) {
    function getUtilitiesForLocation(params) {
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

    function getRatesForUtility(params) {
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
      getUtilitiesForLocation: getUtilitiesForLocation,
      getRatesForUtility: getRatesForUtility
    };
  }];
}
