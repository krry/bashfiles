directives.directive('flnConfigurator', ['Clientstream', 'newConfigurator', flnConfigurator]);

function flnConfigurator (Client, newConfigurator) {
  return {
    restrict: "A",
    templateUrl: 'templates/directives/configurator/flnConfigurator.html',
    controller: function ($scope, $element, $attrs, newConfigurator) {
      Client.listen('draw_busy', function (arg) {
        $scope.draw_busy = arg;
        $scope.$apply();
      });
    },
    link: function (scope, element, attrs) {
      var g_div, o_div;
      g_div = $(element).find('#gmtest')[0];
      o_div = $(element).find('#oltest')[0];

      newConfigurator.setTarget(g_div, o_div);
    }
  };
}
