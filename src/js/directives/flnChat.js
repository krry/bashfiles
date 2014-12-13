directives.directive('flnChat', flnChat);

function flnChat () {
  return {
    // scope: {},
    templateUrl: 'templates/directives/flnChat.html',
    controller: 'ChatCtrl',
    controllerAs: 'chat',
    // link: function(scope, element, attrs) {}
  };
}
