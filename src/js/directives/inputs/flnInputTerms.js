directives.directive('flnInputTerms', [flnInputTerms_]);

function flnInputTerms_ () {
  return {
    restrict: "E",
    templateUrl: "templates/directives/inputs/flnInputTerms.html",
    link: function (scope, element, attrs) {
      // $(element).find('').on('click');
    }
  };
}
