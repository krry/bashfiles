directives.directive('flnInputFirstName', [flnInputFirstName_]);

function flnInputFirstName_ () {
  return {
    scope: {
      hint: "@",
      prospectForm: "=form"
    },
    restrict: "E",
    templateUrl: "templates/directives/inputs/flnInputFirstName.html",
    controller: "FormCtrl as form",
    link: function (scope, element, attrs) {
      $(element).focus();
    }
  };
}
