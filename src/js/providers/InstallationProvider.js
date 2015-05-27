/* =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-

  Installation Provider

  Accesses the installation API in SolarWorks

=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=- */

providers.provider('Installation', [InstallationProvider_ ]);

function InstallationProvider_ () {
  this.$get = ['$http', '$q', 'INSTALLATION_API', 'CHECK_DUPLICATE_API', function($http, $q, INSTALLATION_API, CHECK_DUPLICATE_API) {
    function create(data) {
      var dfd = $q.defer();
      
      $http.post(INSTALLATION_API, data, {
        timeout: 20000
      }).then(function(resp) {
        dfd.resolve(resp.data);
      }, function(resp) {
        // 412 (Precondition failed) means that the installation already exists, and we can still use the returned data
        if (resp.status === 412) {
          dfd.resolve(resp.data);
        } else {
          dfd.reject(resp);
        }
      });

      return dfd.promise;
    }

    function checkDuplicate(params) {
      var dfd = $q.defer();

      $http.get(CHECK_DUPLICATE_API, {
        params: params
      }).then(function(resp) {
        dfd.resolve(resp.data);
      }, function(resp) {
        dfd.reject(resp);
      });

      return dfd.promise;
    }

    return {
      create: create,
      checkDuplicate: checkDuplicate
    };
  }];
}
