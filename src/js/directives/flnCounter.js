function flnCounter($timeout) {
  return {
    replace: true,
    scope: true,
    templateUrl: 'templates/directives/flnCounter.html',
    link: function(scope, element, attrs){

    },
  };
}

directives.directive("flnCounter", ["$timeout", flnCounter]);
