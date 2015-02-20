directives.directive('flnAlternav', flnAlternav);

function flnAlternav () {
  return {
    scope: {
      alternatives: "@alternatives",
    },
    restrict: 'A',
    templateUrl: 'templates/directives/widgets/flnAlternav.html',
    // link: function(scope, element, attrs) {}
  };
}
