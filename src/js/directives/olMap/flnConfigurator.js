directives.directive('flnConfigurator', ['Clientstream', 'newConfigurator', flnConfigurator]);

function flnConfigurator (Client, newConfigurator) {
  return {
    restrict: "A",
    templateUrl: 'templates/directives/configurator/flnConfigurator.html',
    controller: function ($scope, $element, $attrs, newConfigurator) {

    Client.listen('roofpeak', function (argument) {
      $(maps.omap.getViewport()).addClass('roofpeak');
    })

    newConfigurator.configurator().then(function (map) {
      Client.emit('Configurator: update mapsize', map)

    })
      Client.listen('Configurator: update mapsize', function(){
        maps.omap.updateSize();
        var c = maps.omap.getView().getCenter()
        maps.gmap.setCenter({lat:c[1], lng:c[0]});
      })
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

      Client.listen('Configurator: target set', function(argument) {
        var c = maps.omap.getView().getCenter()
        maps.gmap.setCenter({lat:c[1], lng:c[0]});
      });

      $(window).resize(function() {
        var c = maps.omap.getView().getCenter()
        maps.gmap.setCenter({lat:c[1], lng:c[0]});
        maps.omap.updateSize()
      });

      google.maps.event.addDomListenerOnce(window, "load", function () {
        var c = maps.omap.getView().getCenter()
        maps.gmap.setCenter({lat:c[1], lng:c[0]});
        maps.omap.updateSize()
      });
    }
  };
}
