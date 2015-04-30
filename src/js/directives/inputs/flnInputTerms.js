directives.directive('flnInputTerms', [flnInputTerms_]);

function flnInputTerms_ () {
  return {
    restrict: "A",
    templateUrl: "templates/directives/inputs/flnInputTerms.html",
    link: function (scope, element, attrs) {
      // $(element).find('').on('click');
    }
  };
}
