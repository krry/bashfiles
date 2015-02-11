directives.directive('flnInputCity', ["Form", flnInputCity_]);

function flnInputCity_ (Form) {
  return {
    scope: {
      hint: "@"
    },
    restrict: "E",
    templateUrl: "templates/directives/inputs/flnInputCity.html",
    controller: "FormCtrl as form"
  };
}
