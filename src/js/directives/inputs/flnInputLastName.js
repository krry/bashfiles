directives.directive('flnInputLastName', [flnInputLastName_]);

function flnInputLastName_ () {
  return {
    scope: {
      hint: "@",
      prospectForm: "=form"
    },
    restrict: "E",
    templateUrl: "templates/directives/inputs/flnInputLastName.html",
    controller: "FormCtrl as form"
  };
}
