directives.directive('flnAnalytics', [flnAnalytics_]);

function flnAnalytics_ () {
  return {
    restrict: 'E',
    scope: {
      id: '=analyticsId'
    },
    link: function (scope, element, attrs) {
      /* jshint ignore:start */
      function startAnalytics (w,d,s,l,i) {
        w[l] = w[l] || [];

        w[l].push({
          'gtm.start': new Date().getTime(),
          event: 'gtm.js'
        });

        var f = d.getElementsByTagName(s)[0],
            j = d.createElement(s),
            dl = (l != 'dataLayer') ? '&l=' + l : '';

        j.async = true;
        j.src = '//www.googletagmanager.com/gtm.js?id=' + i + dl;
        f.parentNode.insertBefore(j, f);
      }
      debugger;
      startAnalytics(window, document, 'script', 'dataLayer', scope.id);
      /* jshint ignore:end */
    }
  }
}
