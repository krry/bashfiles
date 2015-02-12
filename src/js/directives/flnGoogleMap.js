directives.directive('flnGmap', flnGmap);

function flnGmap() {
  return {
    restrict: "A",
    controller: "GmapCtrl",
    controllerAs: "gmap",
  };
}
