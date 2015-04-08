directives.directive('flnFinePrint', [flnFinePrint_]);

function flnFinePrint_ () {
  return {
    restrict: 'E',
    transclude: true,
    templateUrl: 'templates/directives/widgets/flnFinePrint.html'
  }
}
