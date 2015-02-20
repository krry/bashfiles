directives.directive('flnInputCity', [flnInputCity_]);

function flnInputCity_ () {
  return {
    scope: {
      hint: "@"
    },
    restrict: "E",
    controller: "FormCtrl as form",
    templateUrl: "templates/directives/inputs/flnInputCity.html",
  };
}
