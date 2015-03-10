directives.directive('flnInputFirstName', [flnInputFirstName_]);

function flnInputFirstName_ () {
  return {
    restrict: "E",
    templateUrl: "templates/directives/inputs/flnInputFirstName.html",
    require: '^flnForm',
    link: function (scope, element, attrs) {
      $(element).focus();
    }
  };
}
