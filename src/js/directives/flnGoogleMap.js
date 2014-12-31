function flnGoogleMap($timeout, $document, $window, MapService) {
  return {
    restrict: "A",
    controller: "GoogleMapCtrl",
    controllerAs: "gmap",
    // transclude: true,
    // scope: { onCreate: "&" },
    // link: function flnGoogleMapLink(scope, ele, attrs) {}
  };
}

directives.directive('flnGoogleMap', flnGoogleMap);
