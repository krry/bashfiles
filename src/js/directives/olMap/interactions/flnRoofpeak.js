/* ==================================================

Area peak

this directive enables opens a layer that:
  * magnifies the focused feature

<fln-areapeak area="focused_area"></fln-areapeak>

================================================== */

directives.directive('flnRoofpeak', ["MapFactory", "Design", "Clientstream", "AreaService", "Panelfill", "newConfigurator", flnRoofpeak_]);

function flnRoofpeak_ (MapFactory, Design, Client, AreaService, Panelfill, newConfigurator) {
  return {
    restrict: 'EA',
    link: function flnRoofpeakLink (scope, element, attrs) {
      var base_map,
          old_view,
          feature,
          lay_over_element,
          ol_map,
          roof_peak_map,
          feature_overlay,
          highlight;

      scope.roof_peak_chosen = false;
      feature_overlay = Design.roofpeak_overlay;

      Design.rx_selectedpeak.subscribe(subToPeakSelected);
      function subToPeakSelected (ridgevalue) {
        if (ridgevalue && ridgevalue.hasOwnProperty(0)) {
          // validate the button that lets user progress forward
          scope.roof_peak_chosen = true;
          // highlight the view
        } else {
          scope.roof_peak_chosen = false;
        }
        scope.$apply();
      }
      // save the map
      newConfigurator.configurator().then(function(map) {
        base_map = map;
      });

      // hide "next" button until user selects
      scope.roof_peak_chosen = false;

      // add the "interaction" on the map
      newConfigurator.roofpeakAdd();
      // listen to mousemovements to highlight
      newConfigurator.configurator().then(function(map){
        Client.emit('roofpeak', Design.areas_collection.item(0));
        $(map.getViewport()).on('mousemove', function(evt) {
          var pixel = map.getEventPixel(evt.originalEvent);
          mouseover(pixel);
          function mouseover (pixel) {
            feature = map.forEachFeatureAtPixel(pixel, function(f, layer) {
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
        });
      });
      // handle clicks on the map
      newConfigurator.configurator().then(function(map){
        $(map.getViewport()).on('click', function(evt) {
          var pixel = map.getEventPixel(evt.originalEvent);
          var target_f = map.forEachFeatureAtPixel(pixel, function(f, layer) {
            return f;
          });
          // TODO: do something with clicked shape.
          var testLineString, arrayOfPoints;
          if (target_f &&
              AreaService.getWkt(target_f).split('POLYGON').length == 1) {  //this second condition covers if a polygon was selected
            console.log(AreaService.getWkt(target_f));

            testLineString = AreaService.getWkt(target_f).split('LINESTRING');
            arrayOfPoints = [];
            if (testLineString.length == 1) { //then we have a point
              arrayOfPoints = AreaService.getWkt(target_f).split('POINT')[1].replace('(', '').replace(')', '').split('TRAVIS');
            }
            else {  //we have a line!
              arrayOfPoints = AreaService.getWkt(target_f).split('LINESTRING')[1].replace('(', '').replace(')', '').split(',');
            }
            Design.ref().child('areas').child('0').child('ridge').set(arrayOfPoints);

            // feature_overlay.removeFeature(highlight);
            // feature_overlay.setFeatures([])

            feature_overlay.addFeature(target_f);
            debugger;
            scope.$apply()
          } else {
            console.log('can\'t proceed if you don\'t click a roofpeak, brah');
          }
        });
      })

      element.on('$destroy', function dragPanDestroy (e) {
        // get rid of the peak layer & styling
        newConfigurator.roofpeakDel();
      });
    }
  };
}
