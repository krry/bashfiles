directives.directive('flnAlternatives', [flnAlternatives_]);

function flnAlternatives_ () {
  return {
    templateUrl: 'templates/directives/dialogs/flnAlternatives.html',
    require: '^flnModal',
  };
}
