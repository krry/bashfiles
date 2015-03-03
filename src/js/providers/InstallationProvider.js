/* =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-

  Installation Provider

  Accesses the installation API in SolarWorks

=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=- */

providers.provider('Installation', [InstallationProvider_ ]);

function InstallationProvider_ () {
  this.$get = ['$http', '$q', 'INSTALLATION_API', function($http, $q, INSTALLATION_API) {
    function create(data) {
      var dfd = $q.defer();
      
      $http.post(INSTALLATION_API, data, {
        timeout: 20000
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
