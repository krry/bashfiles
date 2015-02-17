/* ==================================================

Area peak

this directive enables opens a layer that:
  * magnifies the focused feature

<fln-areapeak area="focused_area"></fln-areapeak>

================================================== */

directives.directive('flnRoofpeak', ["MapFactory", "Configurator", flnRoofpeak_]);

function flnRoofpeak_ (MapFactory, Configurator) {
  return {
    restrict: 'EA',
    controllerAs: 'Roofpeak',
    scope: {
      // area: "=", // pass this object, the area we're focused on
    },
    link: function flnRoofpeakLink (scope, element, attrs) {
      // scope.area = scope.design_element.getLayers()
      var base_map = Configurator.map();
      var old_view = base_map.getView();
      var feature = Configurator.features()[0];
      var lay_over_element = $('#roof_peak');
      lay_over_element.show();
      var ol_map = Configurator.map();
      var roof_peak_map = MapFactory.roofArea(ol_map, lay_over_element, feature);

      $(roof_peak_map.getViewport()).on('mousemove', function(evt) {
        var pixel = roof_peak_map.getEventPixel(evt.originalEvent);
        mouseover(pixel);
      });

      var highlight;
      var featureOverlay = roof_peak_map.getOverlays().getArray()[0];

      function mouseover (pixel) {
        var feature = roof_peak_map.forEachFeatureAtPixel(pixel, function(feature, layer) {
          return feature;
        });

        if (feature !== highlight) {
          if (highlight) {
            featureOverlay.removeFeature(highlight);
          }
          if (feature) {
            featureOverlay.addFeature(feature);
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
  };
}
