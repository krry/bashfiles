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
  // duration:         '',      // Animation duration in milliseconds. Default is 250.
  className:        'fln-zoom', // CSS class name. Default is ol-zoom.
  zoomInLabel:      '+',        // Text label to use for the zoom-in button. Default is +
  zoomOutLabel:     '-',        // Text label to use for the zoom-out button. Default is -
  zoomInTipLabel:   'Zoom in',  // Text label to use for the button tip. Default is Zoom in
  zoomOutTipLabel:  'Zoom out', // Text label to use for the button tip. Default is Zoom out
  // delta:            '2',              // The zoom delta applied on each click.
  // target:           '',              // Target.
};

directives
.directive('flnControlZoom', flnControlZoom_ );

function flnControlZoom_ (Configurator) {
  return {
    restrict: 'E',
    link: function flnControlZoomLink (scope, ele, attrs) {
      // create a new zoom controller
      var zoomControl = new ol.control.Zoom(zoom_options);
      // add it to the map
      var controls = Configurator.map().getControls();
      if (controls.getArray().length > 0 ){ // hack: directive fires twice, prevent double controls
        controls.pop();
      }
      Configurator.map().addControl(zoomControl);
      // remove it from the map when the directive gets destroyed
      ele.on('$destroy', function (e) {
        Configurator.map().removeControl(zoomControl);
      });
    },
  };
}
