directives.directive('flnAddGoogleEvent', ['$window', flnAddGoogleEvent_]);

function flnAddGoogleEvent_ ($window) {
  return {
    scope: {
      config: '=flnAddGoogleEvent'
    },
    link: function(scope, element, attrs) {
      element.bind('click', function() {
        var opts = scope.config;

        var url = [
          'https://www.google.com/calendar/render',
          '?action=TEMPLATE',
          '&text=' + formattedText(opts.subject),
          '&dates=' + formattedDate(opts.begin) + '/' + formattedDate(opts.end),
          '&details=' + formattedText(opts.description),
          '&location=' + opts.location,
          '&pli=1',
          '&sf=true',
          '&output=xml',
          '#g'
        ].join('');

        $window.open(url);
      });

      function formattedText(text) {
        return $window.escape(text).replace(/%20/g, '+');
      }

      function formattedDate(date) {
        return date ? new Date(date).toISOString().replace(/(.000)|-|:/g, '') : '';
      }
    }
  };
}