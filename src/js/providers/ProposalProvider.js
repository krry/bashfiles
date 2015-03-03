/* =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-

  Proposal Provider

  Accesses the Proposal API in SolarWorks to generate
  a live proposal for the propspect

=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=- */

providers.provider('Proposal', [ProposalProvider_ ]);

function ProposalProvider_ () {
  this.$get = ['$http', '$q', 'PROPOSAL_API', function($http, $q, PROPOSAL_API) {

    function parseProposalData () {
      
    }

    function create(data) {
      var dfd = $q.defer();

      $http.create(PROPOSAL_API, data, {
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
