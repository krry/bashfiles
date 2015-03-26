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

      feature_overlay = Design.roofpeak_overlay;

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
                // TODO: figure out if deleting a variable is dangerous
                delete highlight;
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
          if (target_f &&
              AreaService.getWkt(target_f).split('POLYGON').length == 1) {  //this second condition covers if a polygon was selected
            // show the "next" button
            scope.roof_peak_chosen = true;
            console.log(AreaService.getWkt(target_f));

            var testLineString = AreaService.getWkt(target_f).split('LINESTRING');
            var arrayOfPoints = [];
            if (testLineString.length == 1) { //then we have a point
              arrayOfPoints = AreaService.getWkt(target_f).split('POINT')[1].replace('(', '').replace(')', '').split('TRAVIS');

            }
            else {  //we have a line!
              arrayOfPoints = AreaService.getWkt(target_f).split('LINESTRING')[1].replace('(', '').replace(')', '').split(',');
            }

            Design.ref().child('areas').child('0').child('ridge').set(arrayOfPoints);
            debugger;

            scope.$apply()
          } else {
            console.log('can\'t proceed if you don\'t click a roofpeak, brah');
          }
        });
      })



      // remove listeners and such
      element.on('$destroy', function dragPanDestroy (e) {
        newConfigurator.roofpeakDel();
      });


      function loadRoofpeak() {

        base_map = maps.omap
        old_view = base_map.getView();

        feature = Design.areas_collection.item(0);
        lay_over_element = $('#roof_peak');
        lay_over_element.show();
        ol_map = base_map;
        roof_peak_map = MapFactory.roofArea(feature);



        feature_overlay = roof_peak_map.getOverlays().getArray()[0];



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
