directives.directive('flnInputCity', [flnInputCity_]);

function flnInputCity_ () {
  return {
    scope: {
      hint: "@"
    },
    restrict: "E",
    templateUrl: "templates/directives/inputs/flnInputCity.html",
  };
}
