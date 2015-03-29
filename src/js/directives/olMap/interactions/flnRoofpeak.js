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
    priority: '10',
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

      $('div[fln-configurator]').addClass('roofpeak');

      function subToPeakSelected (ridgevalue) {
        var selected_wkt, selected_f, current_highlight;
        if (ridgevalue && ridgevalue.hasOwnProperty(0)) {
          // validate the button that lets user progress forward
          scope.roof_peak_chosen = true;
          // create feature from details
          if (ridgevalue.hasOwnProperty(1)) {
            // create a line segment string
            selected_wkt = "LINESTRING(" + ridgevalue[0] + ',' + ridgevalue[1] + ")";
            selected_f = AreaService.featFromTxt(selected_wkt, 'segment');
          } else {
            // create a point string
            selected_wkt = "POINT(" + ridgevalue[0] + ")";
            selected_f = AreaService.featFromTxt(selected_wkt, 'corner');
          }
          // highlight the view
          if (feature_overlay.getFeatures().getLength()) {
            // remove existing highilghts
            feature_overlay.getFeatures().clear();
          }
          if (selected_f) {
            // add new highlight
            feature_overlay.addFeature(selected_f);
          }
          // cache highlight object
          highlight = selected_f;
        } else {
          scope.roof_peak_chosen = false;
        }
        scope.$apply();
      }

      // hide "next" button until user selects
      scope.roof_peak_chosen = false;

      // listen to mousemovements to highlight
      newConfigurator.configurator().then(function(map){
        newConfigurator.roofpeakAdd();
        Design.rx_selectedpeak.subscribe(subToPeakSelected);
        // save the map
        base_map = map;
        // handle clicks and mouse movement to build the interaction on the map
        Client.emit('roofpeak', Design.areas_collection.item(0));
        $('div[fln-configurator]').on('mousemove', roofpeakMousemove);
        $('div[fln-configurator]').on('click', roofpeakMouseclick);
      });
      function roofpeakMousemove(evt) {
        var pixel = base_map.getEventPixel(evt.originalEvent);
        mouseover(pixel);
        function mouseover (pixel) {
          feature = base_map.forEachFeatureAtPixel(pixel, function(f, layer) {
            return f;
          });

          if (feature !== highlight && !scope.roof_peak_chosen) {
            if (highlight) {
              feature_overlay.removeFeature(highlight);
            }
            if (feature) {
              feature_overlay.addFeature(feature);
            }
            highlight = feature;
          }
        }
      }
      function roofpeakMouseclick (evt) {
        var pixel = base_map.getEventPixel(evt.originalEvent);
        debugger;
        var target_f = base_map.forEachFeatureAtPixel(pixel, function(f, layer) {
          return f;
        });
        var testLineString, arrayOfPoints;
        if (target_f &&
            AreaService.getWkt(target_f).split('POLYGON').length == 1) {  //this second condition covers if a polygon was selected
          console.log(AreaService.getWkt(target_f));

          testLineString = AreaService.getWkt(target_f).split('LINESTRING');
          arrayOfPoints = [];
          if (testLineString.length === 1) { //then we have a point
            arrayOfPoints = AreaService.getWkt(target_f).split('POINT')[1].replace('(', '').replace(')', '').split('TRAVIS');
          }
          else {  //we have a line!
            arrayOfPoints = AreaService.getWkt(target_f).split('LINESTRING')[1].replace('(', '').replace(')', '').split(',');
          }
          Design.ref().child('areas').child('0').child('ridge').set(arrayOfPoints);


          feature_overlay.addFeature(target_f);
          scope.$apply()
        } else {
          console.log('can\'t proceed if you don\'t click a roofpeak, brah');
        }
      }
      element.on('$destroy', function dragPanDestroy (e) {
        // get rid of the peak layer & styling
        newConfigurator.roofpeakDel();
        $('div[fln-configurator]').removeClass('roofpeak');
        $('div[fln-configurator]').off('mousemove', roofpeakMousemove);
        $('div[fln-configurator]').off('click', roofpeakMouseclick);
      });
    }
  };
}
