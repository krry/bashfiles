/* =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-

  Rates Provider

  accesses the utility API in SolarWorks

=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=- */

providers.provider('Rates', [RatesProvider_ ]);

function RatesProvider_ () {
  this.$get = ['$http', '$q', 'RATES_API', function($http, $q, RATES_API) {
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
      get: get
    };
  }];
}
