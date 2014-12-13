directives.directive('flnDevTools', flnDevTools);

function flnDevTools () {
  return {
    // scope: {},
    templateUrl: 'templates/directives/flnDevTools.html',
    controller: 'DevCtrl',
    controllerAs: 'dev',
    // link: function(scope, element, attrs) {}
  };
}
