function flnGoogleMap($timeout, $document, $window, MapService) {
  return {
    restrict: "A",
    transclude: true,
    scope: {
      onCreate: "&"
    },
    controllerAs: "gmap",
    controller: "GoogleMapCtrl",
    // link: function flnGoogleMapLink(scope, ele, attrs) {}
  };
}

directives.directive('flnGoogleMap', flnGoogleMap);
