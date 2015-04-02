directives.directive('flnGmap', [flnGmap_]);

function flnGmap_ () {
  return {
    restrict: "A",
    controller: "GmapCtrl",
    controllerAs: "gmap",
  };
}
