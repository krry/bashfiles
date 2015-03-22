directives.directive('flnConfigurator', ['Clientstream', flnConfigurator]);

function flnConfigurator (Client) {
  return {
    restrict: "A",
    templateUrl: 'templates/directives/configurator/flnConfigurator.html',
    controller: function ($scope, $element, $attrs, newConfigurator) {
      newConfigurator.setTarget($element);
      Client.listen('draw_busy', function (arg) {
        $scope.draw_busy = arg;
        $scope.$apply();
      });

    },
  };
}
