/* =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-

  Warehouse Provider

  Accesses the Warehouse API in SolarWorks

=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=- */

providers.provider('Warehouse', [WarehouseProvider_ ]);

function WarehouseProvider_ () {
  this.$get = ['$http', '$q', 'WAREHOUSE_API', function($http, $q, WAREHOUSE_API) {
    function get(params) {
      var dfd = $q.defer();

      $http.get(WAREHOUSE_API, { params: params }).then(function(resp) {
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
