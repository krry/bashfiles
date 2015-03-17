directives.directive('flnAlternatives', flnAlternatives);

function flnAlternatives () {
  return {
    templateUrl: 'templates/directives/dialogs/flnAlternatives.html',
    require: '^flnModal',
  };
}
