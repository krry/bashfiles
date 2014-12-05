/* ==================================================
  JwtService

================================================== */

angular.module('flannel').factory('JwtService',['$http', 'FBURL', JwtService_]);

function JwtService_ ($http, FBURL) {

  var service = {
    jwt: jwt,
  };

  // Get /jwt.  Use the resulting data (a jwt) and pass it to FireBase for authentication
  function jwt() {
    $http.get('/jwt').success(function (data) {
      var ref = new Firebase(FBURL);
      ref.authWithCustomToken(data, function(error, authData) {
        if (error) {
          console.log("Login Failed!", error);
        } else {
          console.log("Login Succeeded!", authData);
        }
      });

    }).error(function (a,b,c,d) {
      console.log("There was an error getting the jwt.");
    });
  }

  return service;
}