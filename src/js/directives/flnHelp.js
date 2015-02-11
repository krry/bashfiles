directives.directive('flnHelp', flnHelp);

function flnHelp () {
  return {
    templateUrl: 'templates/directives/flnHelp.html',
    link: function(scope, element, attrs) {
      function toggleShown () {
        scope.shown = !scope.shown;
        return scope.shown;
      }
      scope.toggleShown = toggleShown;
    }
  };
}
