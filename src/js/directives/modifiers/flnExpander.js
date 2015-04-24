directives.directive('flnExpander', [flnExpander_]);

function flnExpander_ () {
  return {
    restrict: 'E',
    transclude: true,
    templateUrl: 'templates/directives/modifiers/flnExpander.html',
    link: function (scope, element, attrs) {
      scope.shown = true;
      $(element).find('.expander').on('click', toggleShown);

      function toggleShown () {
        scope.shown = !scope.shown;
        return scope.shown;
      }
    }
  }
}
