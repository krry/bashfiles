/* =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-

  Salesforce Provider

  Accesses the Salesforce controller in server/controllers

=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=- */

providers.provider('Salesforce', [SalesforceProvider_ ]);

function SalesforceProvider_ () {
  var session;

  this.setSession = function(obj) {
    session = obj;
  };

  this.$get = ['$http', '$q', 'Clientstream', 'SF_LEAD_API', 'SF_IDENTITY_API', function($http, $q, Client, SF_LEAD_API, SF_IDENTITY_API) {
    var statuses = {
      savedDesign: 'Saved design',
      savedProposal: 'Saved proposal',
      contact: 'Pre credit check',
      failCredit: 'Insufficient credit',
      passCredit: 'Pass credit',
      noCreditResult: 'Credit unknown',
      scheduledSiteSurvey: 'Scheduled site survey',
      networkError: 'Network error',
      noFinancing: 'No TPO available',
      batteryLead: 'Battery lead'
    };

    function createLead(data) {
      var dfd = $q.defer();
      
      $http.post(SF_LEAD_API, data).then(function(resp) {
        dfd.resolve(resp.data);
      }, function(resp) {
        dfd.reject(resp);
      });

      return dfd.promise;
    }

    function getIdentity(data) {
      var dfd = $q.defer();

      $http.post(SF_IDENTITY_API, data).then(function(resp) {
        dfd.resolve(resp.data);
      }, function(resp) {
        dfd.reject(resp);
      });

      return dfd.promise;
    }

    return {
      createLead: createLead,
      getIdentity: getIdentity,
      statuses: statuses,
      session: session
    };
  }];
}
