directives.directive('flnInputTerms', [flnInputTerms_]);

function flnInputTerms_ () {
  return {
    scope: {
      prospectForm: "=form"
    },
    restrict: "E",
    templateUrl: "templates/directives/inputs/flnInputTerms.html",
    controller: "FormCtrl as form",
    link: function (scope, element, attrs) {
      // $(element).find('').on('click');
    }
  };
}
