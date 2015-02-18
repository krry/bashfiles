directives.directive('flnInputZip', [flnInputZip_]);

function flnInputZip_ () {
  return {
    scope: {
      hint: "@"
    },
    restrict: "E",
    templateUrl: "templates/directives/inputs/flnInputZip.html",
    link: function (scope, element, attrs) {
      if (!$('#prospect_street')) {
        $(element).focus();
      }
    },
  };
}
