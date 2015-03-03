/* =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-

  Contact Provider

  Accesses the create contact API in SolarWorks

=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=- */

providers.provider('Contact', [ContactProvider_ ]);

function ContactProvider_ () {
  this.$get = ['$http', '$q', 'CONTACT_API', function($http, $q, CONTACT_API) {
    function create(data) {
      var dfd = $q.defer();
      
      $http.post(CONTACT_API, data, {
        timeout: 60000
      }).then(function(resp) {
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
