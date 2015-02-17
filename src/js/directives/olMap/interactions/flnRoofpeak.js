/* ==================================================

Area peak

this directive enables opens a layer that:
  * magnifies the focused feature

<fln-areapeak area="focused_area"></fln-areapeak>

================================================== */

directives.directive('flnRoofpeak', ["MapFactory", "Configurator", "Clientstream", flnRoofpeak_]);

function flnRoofpeak_ (MapFactory, Configurator, Client) {
  return {
    restrict: 'EA',
    controllerAs: 'Roofpeak',
    link: function flnRoofpeakLink (scope, element, attrs) {
      var base_map,
          old_view,
          feature,
          lay_over_element,
          ol_map,
          roof_peak_map,
          feature_overlay,
          highlight;

      if (Configurator.map()) {
        loadRoofpeak();
      } else {
        Client.listen('OlMapCtrl: remote feature added', loadRoofpeak);
      }
      function loadRoofpeak() {
        console.log('roofPeak');
        base_map = Configurator.map();
        old_view = base_map.getView();
        feature = Configurator.features()[0];
        lay_over_element = $('#roof_peak');
        lay_over_element.show();
        ol_map = Configurator.map();
        roof_peak_map = MapFactory.roofArea(ol_map, lay_over_element, feature);

        $(roof_peak_map.getViewport()).on('mousemove', function(evt) {
          var pixel = roof_peak_map.getEventPixel(evt.originalEvent);
          mouseover(pixel);
        });

        feature_overlay = roof_peak_map.getOverlays().getArray()[0];

        function mouseover (pixel) {
          var f = roof_peak_map.forEachFeatureAtPixel(pixel, function(feature, layer) {
            return f;
          });

          if (feature !== highlight) {
            if (highlight) {
              feature_overlay.removeFeature(highlight);
            }
            if (feature) {
              feature_overlay.addFeature(feature);
            }
            highlight = feature;
          }
        }

        roof_peak_map.setTarget(lay_over_element[0]);
        lay_over_element.width(ol_map.getSize()[0]); // (jesse) HACK: we shouldn't have to do this... but we do.
        roof_peak_map.updateSize();
        element.on('$destroy', function () {
          console.log('should remove the roofpeak now');
          base_map.setView(old_view);
          lay_over_element.html('');
          lay_over_element.hide();
          // remove the map
          // save any details to firebase?
        });
      }

    }
  };
}
