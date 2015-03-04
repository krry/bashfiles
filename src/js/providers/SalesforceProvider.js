/* =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-

  Salesforce Provider

  Accesses the Salesforce controller in server/controllers

=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=- */

providers.provider('Salesforce', [SalesforceProvider_ ]);

function SalesforceProvider_ () {
  this.$get = ['$http', '$q', 'SFLEAD_API', function($http, $q, SFLEAD_API) {
    function createLead(data) {
      var dfd = $q.defer();
      
      $http.post(SFLEAD_API, data).then(function(resp) {
        dfd.resolve(resp.data);
      }, function(resp) {
        dfd.reject(resp);
      });

      return dfd.promise;
    }

    return {
      createLead: createLead
    };
  }];
}
