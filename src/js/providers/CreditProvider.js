/* =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-

  Credit Provider



=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=- */

providers.provider('Credit', [CreditProvider_ ]);

function CreditProvider_ () {
  this.$get = ['$http', '$q', function($http, $q) {
    var products = {
      Cash: 'Cash',
      Lease: 'Lease',
      PPA: 'PPA',
      Loan: 'Loan'
    };

    // TODO: hit the acutal API endpoint once job creation is in test
    function check(data) {
      var dfd = $q.defer();

      var eligibleProducts = [products.Cash, products.Loan];

      // Arbitrary logic to test when user is non-qualified (dob == 199x)
      if (data.BirthDate.indexOf('/199') < 0) {
        eligibleProducts.push(products.Lease, products.PPA);
      }

      dfd.resolve({
        EligibleProducts: eligibleProducts,
        CreditResultFound: true,
        ResponseMessage: 'Success' 
      });

      return dfd.promise;
    }

    return {
      check: check,
      products: products
    };
  }];
}
