directives.directive('flnTip', [flnTip_]);

function flnTip_ () {
  return {
    restrict: "E",
    transclude: true,
    scope: {
      tiptext: "@tiptext",
      position: "@position",
    },
    templateUrl: "templates/directives/modifiers/flnTip.html",
    controller: function ($scope) {
      // console.log('tip control', $scope);
    },
    link: function (scope, element, attrs) {
      // console.log('tooling tip', scope);
      $(element).on('hover', function () {
        scope.tipShown = true;
      });
      $(element).on('blur', function () {
        scope.tipShown = false;
      });
    },
  }
}
