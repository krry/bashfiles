directives.directive('flnInputStreet', [flnInputStreet_]);

function flnInputStreet_ () {
  return {
    scope: {
      hint: "@"
    },
    restrict: "E",
    templateUrl: "templates/directives/inputs/flnInputStreet.html",
    controller: "FormCtrl as form"
  };
}
