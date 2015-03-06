/* =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-

  Credit Provider

  Accesses the credit check API in SolarWorks

=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=- */

providers.provider('Credit', [CreditProvider_ ]);

function CreditProvider_ () {
  this.$get = ['$http', '$q', 'CREDIT_CHECK_API', function($http, $q, CREDIT_CHECK_API) {
    var products = {
      Cash: 'Cash',
      Lease: 'Lease',
      PPA: 'PPA',
      Loan: 'Loan'
    };

    var bureaus = {
      Equifax: 'Equifax',
      Transunion: 'Transunion',
      Experian: 'Experian'
    };

    function check(data) {
      var dfd = $q.defer();

      $http.post(CREDIT_CHECK_API, data, {
        timeout: 30000,
        cache: true
      }).then(function(resp) {
        dfd.resolve(parse(resp.data));
      }, function(resp) {
        dfd.reject(resp);
      });

      return dfd.promise;
    }

    // Logic to determine if user qualifies for financing
    function parse(data) {
      var qualified = data.EligibleProducts.indexOf(products.Lease) > -1 ||
        data.EligibleProducts.indexOf(products.PPA) > -1;

      data.qualified = qualified;
      return data;
    }

    return {
      check: check,
      parse: parse,
      products: products,
      bureaus: bureaus
    };
  }];
}
