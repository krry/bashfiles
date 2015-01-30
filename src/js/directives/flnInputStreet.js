directives.directive('flnInputStreet', ["Form", flnInputStreet_]);

function flnInputStreet_ (Form) {
  return {
    scope: {
      hint: "@"
    },
    restrict: "E",
    templateUrl: "templates/directives/flnInputStreet.html",
    controller: "FormCtrl as form"
  };
}
