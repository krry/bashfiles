directives.directive('flnAutolocate', flnAutolocate);

function flnAutolocate () {
  return {
    restrict: 'E',
    replace: true,
    templateUrl: 'templates/directives/modifiers/flnAutolocate.html',
    controller: "GmapCtrl as gmap",
  };
}
