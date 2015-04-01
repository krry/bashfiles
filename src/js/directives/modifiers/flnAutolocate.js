directives.directive('flnAutolocate', [flnAutolocate_]);

function flnAutolocate_ () {
  return {
    restrict: 'E',
    replace: true,
    templateUrl: 'templates/directives/modifiers/flnAutolocate.html',
    controller: "GmapCtrl as gmap",
  };
}
