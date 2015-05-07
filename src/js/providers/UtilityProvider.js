/* =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-

  Utility Provider

  accesses the utility API in SolarWorks

=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=- */

providers.provider('Utility', [UtilityProvider_ ]);

function UtilityProvider_ () {
  this.$get = ['$http', '$q', 'UTILITIES_API', function ($http, $q, UTILITIES_API) {
    var otherUtilityID = 400;

    function get (params) {

      var dfd = $q.defer();

      $http.get(UTILITIES_API, {
        params: params,
        cache: true
      }).then(function (resp) {
        var data = parse(resp.data);

        dfd.resolve(data);
      }, function(resp) {
        dfd.reject(resp);
      });

      return dfd.promise;

    }

    function parse(data) {
      var unique = [];
      unique.push(data[0]);

      for (var i = 1, len = data.length; i < len; i++) {
        if (data[i].UtilityId !== data[i-1].UtilityId) {
          unique.push(data[i]);
        }
      }

      // All calls also have an 'Other Electric Utility' which we don't care about
      // Checking the last index for this and removing it if found
      // Don't remove it if it's the only utility returned - still need a id for rates check
      if (unique.length > 1 && unique[unique.length - 1].UtilityId === otherUtilityID) {
        unique.pop();
      }

      return unique;
    }

    return { get : get };

  }];
}
