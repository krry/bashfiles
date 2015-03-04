/* =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-

  SalesForce Provider

  Accesses the salesforce controller in server/controllers

=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=- */

providers.provider('SalesForce', [SalesForceProvider_ ]);

function SalesForceProvider_ () {
  this.$get = ['$http', '$q', 'SFLEAD_API', function($http, $q, SFLEAD_API) {
    function create(data) {
      var dfd = $q.defer();
      
      $http.post(SFLEAD_API, data).then(function(resp) {
        dfd.resolve(resp.data);
      }, function(resp) {
        dfd.reject(resp);
      });

      return dfd.promise;
    }

    return {
      create: create
    };
  }];
}
