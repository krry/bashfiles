directives.directive('flnFesTools', [flnFesTools_]);

function flnFesTools_ () {
  return {
    templateUrl: 'templates/directives/widgets/flnFesTools.html',
    controller: 'FesCtrl',
    controllerAs: 'fes'
  };
}
