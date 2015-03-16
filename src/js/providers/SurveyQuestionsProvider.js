/* =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-

  Survey Questions Provider

  Accesses the site survey questions API in SolarWorks

=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=- */

providers.provider('SurveyQuestions', [SurveyQuestionsProvider_ ]);

function SurveyQuestionsProvider_ () {
  this.$get = ['$http', '$q', 'SURVEY_QUESTIONS_API', function($http, $q, SURVEY_QUESTIONS_API) {
    function save(data) {
      var dfd = $q.defer();

      $http.post(SURVEY_QUESTIONS_API, data, {
        timeout: 20000
      }).then(function(resp) {
        dfd.resolve(resp.data);
      }, function(resp) {
        dfd.reject(resp);
      });

      return dfd.promise;
    }

    return {
      save: save
    };
  }];
}
