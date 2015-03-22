directives.directive('flnInputStreet', ["$timeout", flnInputStreet_]);

function flnInputStreet_ ($timeout) {
  return {
    restrict: "E",
    templateUrl: "templates/directives/inputs/flnInputStreet.html",
    require: '^flnForm',
    link: function (scope, element, attrs) {
      scope.focus = attrs.focus;
      $timeout(function (){
        // element[0].focus();
      }, 0);
    },
  };
}
