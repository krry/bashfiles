directives.directive('flnInputFirstName', ['$timeout', flnInputFirstName_]);

function flnInputFirstName_ ($timeout) {
  return {
    restrict: "E",
    templateUrl: "templates/directives/inputs/flnInputFirstName.html",
    require: '^flnForm',
    link: function(scope, element, attrs) {
      $timeout(function() {
        // element[0].focus();
      }, 0);
    }
  };
}
