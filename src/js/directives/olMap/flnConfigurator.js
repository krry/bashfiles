directives.directive('flnConfigurator', ['Clientstream', 'Design', 'newConfigurator', flnConfigurator_]);

function flnConfigurator_ (Client, Design, newConfigurator) {
  return {
    restrict: "A",
    priority: 100,
    templateUrl: 'templates/directives/configurator/flnConfigurator.html',
    controller: ['$scope', function flnConfiguratorCtrl_($scope) {

      newConfigurator.configurator().then(function (map) {
        Client.emit('Configurator: update mapsize', map)
      })

      Client.listen('Configurator: update mapsize', function(){
        setTimeout(function () {
          maps.omap.updateSize();
          var c = maps.omap.getView().getCenter()
          maps.gmap.setCenter({lat:c[1], lng:c[0]});
        },0);
      })

      Client.listen('draw_busy', function (arg) {
        $scope.draw_busy = arg;
        if (!$scope.$$phase) $scope.$apply();
      });
    }],
    link: function (scope, element, attrs) {
      var g_div, o_div;
      g_div = $(element).find('#gmtest')[0];
      o_div = $(element).find('#oltest')[0];

      Design.rx_design().then(startConfiguratorMaps);

      function startConfiguratorMaps (rx_d) {
        // set the target
        newConfigurator.setTarget(g_div, o_div);
        // on window resize, make sure to update the mapsize // TODO: figure out which listeners can be ignored
        $(window).resize(function() {
          var c = maps.omap.getView().getCenter()
          maps.gmap.setCenter({lat:c[1], lng:c[0]});
          maps.omap.updateSize()
        });
        // on window loaded, make sure to update the mapsize // TODO: figure out which listeners can be ignored
        google.maps.event.addDomListenerOnce(window, "load", function () {
          var c = maps.omap.getView().getCenter()
          maps.gmap.setZoom(maps.omap.getView().getZoom());
          maps.gmap.setCenter({lat:c[1], lng:c[0]});
          maps.omap.updateSize()
        });
      }

    },
  };
}
