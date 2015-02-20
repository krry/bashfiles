/* =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-

  Credit Provider



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

    // TODO: hit the acutal API endpoint once job creation is in test
    function check(data) {
      // return $http.post(CREDIT_CHECK_API, data);

      var dfd = $q.defer(),
          eligibleProducts = [products.Cash, products.Loan];

      // Arbitrary logic to test when user is non-qualified (dob == 199x)
      if (data.BirthDate.indexOf('/199') < 0) {
        eligibleProducts.push(products.Lease, products.PPA);
      }

      dfd.resolve(parse({
        EligibleProducts: eligibleProducts,
        CreditResultFound: true,
        ResponseMessage: 'Success' 
      }));

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
      products: products
    };
  }];
}
