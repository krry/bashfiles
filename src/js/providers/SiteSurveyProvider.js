/* =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-

  Site Survey Provider

  Accesses the site survey API in GSA

=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=- */

providers.provider('SiteSurvey', [SiteSurveyProvider_ ]);

function SiteSurveyProvider_ () {
  this.$get = ['$http', '$q', 'GSA_API', function($http, $q, GSA_API) {
    var timeFormat = 'M/D/YYYY h:mm:ssA';

    function isCurrent(time) {
      return moment(time, timeFormat).isAfter(moment(), 'day');
    }

    function getTimes(params) {
      var dfd = $q.defer();

      $http.get(GSA_API, { 
        params: params,
        cache: true,
        timeout: 20000
      }).then(function(resp) {
        var data = JSON.parse(resp.data);
        try {
          data = JSON.parse(data);
        } catch(e) {}
        data = data.AvailableTimes.TimeStrings;
        dfd.resolve(data.filter(isCurrent));
      }, function(resp) {
        dfd.reject(resp);
      });

      return dfd.promise;
    }

    function scheduleTime(data) {
      var dfd = $q.defer();

      $http.post(GSA_API, data, {
        timeout: 20000
      }).then(function(resp) {
        var data = JSON.parse(resp.data);
        try {
          data = JSON.parse(data);
        } catch(e) {}
        dfd.resolve(data);
      }, function(resp) {
        dfd.reject(resp);
      });

      return dfd.promise;
    }

    return {
      getTimes: getTimes,
      scheduleTime: scheduleTime,
      timeFormat: timeFormat
    };
  }];
}
