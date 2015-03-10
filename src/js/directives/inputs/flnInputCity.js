directives.directive('flnInputCity', [flnInputCity_]);

function flnInputCity_ () {
  return {
    restrict: "E",
    templateUrl: "templates/directives/inputs/flnInputCity.html",
    require: '^flnForm',
  };
}
