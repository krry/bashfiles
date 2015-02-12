/* ==================================================
pan controls

these directives add buttons to the map

Styling: style with "fln-zoom" (maybe "fln-zoom-in && fln-zoom-out")

Zoom Control Template

Usage: <fln-control-zoom></fln-control-zoom>
 - add buttons on to a map

usage: <button fln-map-zoom scalar="[in/out]">
 - turn any element into a map control

see: http://openlayers.org/en/v3.0.0/apidoc/ol.control.Zoom.html

================================================== */


directives
.directive('flnControlPan', flnControlPan_ )
.directive('flnMapPan', flnMapPan_ );

function flnControlPan_ (Configurator) {
  return {
    restrict: 'E',
    controllerAs: 'PanCtrl',
    controller: function flnControlPanControl () {
      var vm = this;
      vm.size = Configurator.map().getSize();
      vm.view = Configurator.map().getView();
    },
    templateUrl: "templates/directives/olmap/flnControlPan.html",
  };
}

function flnMapPan_ (Configurator) {
  return {
    restrict: 'A',
    scope: {
      // view: '=mapView',
      direction: '@panDirection',
      // size: '=mapSize',
    },
    link: function flnMapPanLink (scope, ele, attrs) {
      ele.on('click', function() {
        return panCenter(Configurator.map().getView(), scope.direction, Configurator.map().getSize());
      });
      ele.on('$destroy', function () {
        console.log('no more pan control for ', scope.direction);
      });
      function panCenter (view, direction, size) {
        var newCenter;
        var currentCenter = view.getCenter();
        switch (direction) {
          case "up":
            currentCenter[1] = currentCenter[1]+(size[1]/10);
            newCenter = currentCenter;
            break;
          case "down":
            currentCenter[1] = currentCenter[1]-(size[1]/10);
            newCenter = currentCenter;
            break;
          case "right":
            currentCenter[0] = currentCenter[0]+(size[0]/10);
            newCenter = currentCenter;
            break;
          case "left":
            currentCenter[0] = currentCenter[0]-(size[0]/10);
            newCenter = currentCenter;
            break;
        }
        console.log(newCenter)
        return view.setCenter(newCenter);
      }
    },
  };
}
