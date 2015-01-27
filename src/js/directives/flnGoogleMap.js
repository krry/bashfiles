directives.directive('flnGmap', flnGmap);

function flnGmap() {
  return {
    restrict: "A",
    controller: "GmapCtrl",
    controllerAs: "gmap",
    // transclude: true,
    // scope: { onCreate: "&" },
    // link: function flnGoogleMapLink(scope, ele, attrs) {}
  };
}
