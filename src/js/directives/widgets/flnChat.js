directives.directive('flnChat', flnChat);

function flnChat () {
  return {
    // scope: {},
    templateUrl: 'templates/directives/widgets/flnChat.html',
    controller: 'ChatCtrl',
    controllerAs: 'chat',
    // link: function(scope, element, attrs) {}
  };
}
