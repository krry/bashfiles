/* =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-

  Credit Provider



=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=- */

providers.provider('Contact', [ContactProvider_ ]);

function ContactProvider_ () {
  this.$get = ['$http', '$q', 'CONTACT_API', function($http, $q, CONTACT_API) {
    // TODO: hit actual API endpoint once it's in test
    function create(data) {
      // return $http.post(CONTACT_API, data);

      var dfd = $q.defer();
      dfd.resolve({
        "ContactId": 805983,
        "AddressId": 624534,
        "FirstName": "Sergio",
        "LastName": "Umana"
      });

      return dfd.promise;
    }

    return {
      create: create
    };
  }];
}
