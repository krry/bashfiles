directives.directive('flnAnalytics', [flnAnalytics_]);

function flnAnalytics_ () {
  return {
    restrict: 'E',
    scope: {
      id: '=analyticsId'
    },
    templateUrl: 'templates/directives/flnAnalytics.html'
  }
}
