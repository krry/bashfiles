/* =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-

  Auth Provider

  Accesses the jwt token generator and authenticates to Firebase

=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=- */

providers.provider('Auth', [AuthProvider_ ]);

function AuthProvider_ () {
  this.$get = ['$http', '$q', 'FIREBASE_URL', function($http, $q, FIREBASE_URL) {
    function authenticate() {
      var dfd = $q.defer(),
          ref = new Firebase(FIREBASE_URL);

      $http.get('/jwt').then(function(resp) {
        var token = resp.data;

        ref.authWithCustomToken(token, function(error, authData) {
          if (error) {
            dfd.reject(error);
          } else {
            dfd.resolve(authData);
          }
        });
      });

      return dfd.promise;
    }

    return {
      authenticate: authenticate
    };
  }];
}
