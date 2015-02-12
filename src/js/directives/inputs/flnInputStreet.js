directives.directive('flnInputStreet', ["Form", flnInputStreet_]);

function flnInputStreet_ (Form) {
  return {
    scope: {
      hint: "@"
    },
    restrict: "E",
    templateUrl: "templates/directives/inputs/flnInputStreet.html",
    controller: "FormCtrl as form",
    link: function (scope, element, attrs) {
      $(element).focus();
    }
  };
}
