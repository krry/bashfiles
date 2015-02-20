directives.directive('flnInputFullName', [flnInputFullName_]);

function flnInputFullName_ () {
  return {
    scope: {
      hint: "@"
    },
    restrict: "E",
    templateUrl: "templates/directives/inputs/flnInputFullName.html",
    controller: "FormCtrl as form",
    link: function (scope, element, attrs) {
      $(element).focus();
    }
  };
}
