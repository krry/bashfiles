/* =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-

  Site Survey Provider

  Accesses the site survey API in GSA

=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=- */

providers.provider('SiteSurvey', [SiteSurveyProvider_ ]);

function SiteSurveyProvider_ () {
  this.$get = ['$http', '$q', 'GSA_API', function($http, $q, GSA_API) {
    var timeFormat = 'M/DD/YYYY h:mm:ssA';

    function isCurrent(time) {
      return moment(time, timeFormat).isAfter(moment(), 'day');
    }

    // TODO: replace mocked response with call to GSA api provider
    function getTimes() {
      var dfd = $q.defer();

      var times = [
        moment().add(1, 'day').format(timeFormat),
        moment().add(2, 'day').format(timeFormat),
        '2/18/2015 11:00:00AM',
        '2/19/2015 11:00:00AM',
        '2/21/2015 9:00:00AM',
        '2/22/2015 11:00:00AM',
        '2/23/2015 9:00:00AM',
        '2/23/2015 11:00:00AM',
        '2/26/2015 8:00:00AM',
        '2/27/2015 7:00:00AM',
        '2/27/2015 11:00:00AM',
        '3/2/2015 9:00:00AM',
        '3/5/2015 7:00:00AM',
        '3/9/2015 7:00:00AM',
        '3/10/2015 11:00:00AM',
        '3/12/2015 11:00:00AM'
      ];

      dfd.resolve(times.filter(isCurrent));

      return dfd.promise;
    }

    // TODO: replace mocked response with call to GSA api provider
    function scheduleTime() {
      var dfd = $q.defer();
      dfd.resolve('success');
      return dfd.promise;
    }

    return {
      getTimes: getTimes,
      scheduleTime: scheduleTime
    };
  }];
}
