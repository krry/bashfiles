directives.directive('flnDevTools', [flnDevTools_]);

function flnDevTools_ () {
  return {
    // scope: {},
    templateUrl: 'templates/directives/flnDevTools.html',
    controller: 'DevCtrl',
    controllerAs: 'dev',
    // link: function(scope, element, attrs) {}
  };
}
