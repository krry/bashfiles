/* ==================================================
zoom controls

these directives add buttons to the map

Styling: style with "fln-zoom" (maybe "fln-zoom-in && fln-zoom-out")

Zoom Control Template

Usage: <fln-control-zoom></fln-control-zoom>
 - add buttons on to a map

// TODO - build a fln-map-zoom directive
usage: <button fln-map-zoom scalar="[in/out]">
 - turn any element into a map control

see: http://openlayers.org/en/v3.0.0/apidoc/ol.control.Zoom.html

================================================== */

var zoom_options = {
  duration:         '100',      // Animation duration in milliseconds. Default is 250.
  className:        'fln-zoom', // CSS class name. Default is ol-zoom.
  zoomInLabel:      '+',        // Text label to use for the zoom-in button. Default is +
  zoomOutLabel:     '-',        // Text label to use for the zoom-out button. Default is -
  zoomInTipLabel:   'Zoom in',  // Text label to use for the button tip. Default is Zoom in
  zoomOutTipLabel:  'Zoom out', // Text label to use for the button tip. Default is Zoom out
  delta:            '.01',              // The zoom delta applied on each click.
  // target:           '',              // Target.
};

directives
.directive('flnControlZoom', flnControlZoom_ );

function flnControlZoom_ (MapService) {
  return {
    restrict: 'E',
    // templateUrl: "templates/directives/flnControlZoom.html",
    link: function flnControlZoomLink (scope, ele, attrs) {
      // create a new zoom controller
      var zoomControl = new ol.control.Zoom(zoom_options);
      // add it to the map
      MapService.getOmap().addControl(zoomControl);
      // remove it from the map when the directive gets destroyed
      ele.on('$destroy', function (e) {
        MapService.getOmap().removeControl(zoomControl);
      });
    },
  };
}
