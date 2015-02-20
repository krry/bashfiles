directives.directive('flnInputZip', [flnInputZip_]);

function flnInputZip_ () {
  return {
    scope: {
      hint: "@"
    },
    restrict: "E",
    controller: "FormCtrl as form",
    templateUrl: "templates/directives/inputs/flnInputZip.html",
    link: function (scope, element, attrs) {
      if (!$('#prospect_street')) {
        $(element).focus();
      }
    },
  };
}
