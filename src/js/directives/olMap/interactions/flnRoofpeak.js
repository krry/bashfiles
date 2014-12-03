/* ==================================================

Area peak

this directive enables opens a layer that:
  * magnifies the focused feature

<fln-areapeak area="focused_area"></fln-areapeak>

================================================== */

directives
.directive('flnRoofpeak', flnRoofpeak_ )

function flnRoofpeak_ (MapFactory, MapService, LayerService) {
  return {
    restrict: 'E',
    controllerAs: 'Roofpeak',
    scope: {
      // area: "=", // pass this object, the area we're focused on
      // design_element: "=", // the element of the design we're looking at
    },
    link: function flnRoofpeakLink (scope, element, attrs) {
      // scope.design_element = MapService.getOmap();
      // scope.area = scope.design_element.getLayers()
      var base_map = MapService.getOmap();
      var old_view = base_map.getView();
      var f_layer = LayerService.get('area');

      var f_source = f_layer.getSource();
      var f_area = f_source.getFeatures()[0];

      var lay_over_element = $('#roof_peak')[0];
      var ol_map = MapService.getOmap();
      var roof_peak_map = MapFactory.roofArea(ol_map, lay_over_element, f_area);

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

      roof_peak_map.setTarget(lay_over_element);
      element.on('$destroy', function () {
        console.log('should remove the roofpeak now');
        $('#roof_peak').remove();
        base_map.setView(old_view);
        // remove the map
        // save any details to firebase?
      });
    }
  }
}
