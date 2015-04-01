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
.directive('flnControlPan', [flnControlPan_])
.directive('flnMapPan', ['View', 'newConfigurator', flnMapPan_]);

function flnControlPan_ () {
  return {
    restrict: 'E',
    templateUrl: "templates/directives/olmap/flnControlPan.html",
  };
}

function flnMapPan_ (View, newConfigurator) {
  return {
    restrict: 'A',
    scope: {
      direction: '@panDirection',
    },
    link: function flnMapPanLink (scope, ele, attrs) {
      ele.on('click', function() {
        var view, direction, ne, sw, vh_bump;
        view = View;
        direction = scope.direction;
        // google map corners
        ne = newConfigurator.map.gmap.getBounds().getNorthEast();
        sw = newConfigurator.map.gmap.getBounds().getSouthWest();
        // vertical or horizontal shift of center
        vh_bump = {
          v: Math.abs(ne.lat() - sw.lat())/15,
          h: Math.abs(ne.lng() - sw.lng())/15,
        };
        return panCenter(view, direction, vh_bump);
      });

      function panCenter (view, direction, bump) {
        var newCenter;
        var currentCenter = view.getCenter();
        switch (direction) {
          case "up":
            currentCenter[1] = currentCenter[1]+bump.v;
            newCenter = currentCenter;
            break;
          case "down":
            currentCenter[1] = currentCenter[1]-bump.v;
            newCenter = currentCenter;
            break;
          case "right":
            currentCenter[0] = currentCenter[0]+bump.h;
            newCenter = currentCenter;
            break;
          case "left":
            currentCenter[0] = currentCenter[0]-bump.h;
            newCenter = currentCenter;
            break;
        }
        return view.setCenter(newCenter);
      }
    },
  };
}
