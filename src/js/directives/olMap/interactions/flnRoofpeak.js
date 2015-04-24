/* ==================================================

Area peak

this directive enables opens a layer that:
  * magnifies the focused feature

<fln-areapeak area="focused_area"></fln-areapeak>

================================================== */

directives.directive('flnRoofpeak', ["MapFactory", "Design", "Clientstream", "AreaService", "Panelfill", "newConfigurator", "Layers", flnRoofpeak_]);

function flnRoofpeak_ (MapFactory, Design, Client, AreaService, Panelfill, newConfigurator, Layers) {
  return {
    restrict: 'EA',
    priority: '10',
    link: function flnRoofpeakLink (scope, element, attrs) {
      var feature,
          h_coll,
          rx_highlight,
          highlight;

      // highlighted feature stream
      rx_highlight = new Rx.BehaviorSubject(null);
      // style yourself like a big boy
      $('div[fln-configurator]').addClass('roofpeak');

      // a collection to hold the highlighted feature
      h_coll = Layers.h_coll;

      // flow control and "next" button depend on this
      scope.roof_peak_chosen = false;

      // subscribe to the "wkt/0/ridge" _ref
      Design.rx_selectedpeak.subscribe(subToPeakSelected);

      // sub view to highlight on click or mouseover or remote
      var view_highlight = rx_highlight.subscribe(subViewToHighlight);

      // when you have a configurator, use it like a big boy
      newConfigurator.configurator().then(function(map){
        Layers.roofpeak_overlay.setMap(maps.omap)
        newConfigurator.roofpeakAdd();
        // handle clicks and mouse movement to build the interaction on the map
        Client.emit('roofpeak', Design.areas_collection.item(0));
        $('div[fln-configurator]').on('mousemove', roofpeakMousemove);
        $('div[fln-configurator]').on('click', roofpeakMouseclick);
      });

      function subViewToHighlight (f) {
        if (f === null) {
          // clear any the highlighted features
          h_coll.clear();
          scope.roof_peak_chosen = false;
        } else {
          // add the feature to the collection
          h_coll.clear();
          h_coll.push(f);
        }
        // if (!scope.$$phase) scope.$apply();
        scope.$apply(); // TODO: why does this cause a $digest error? & how do we make this work
      }

      function highlightFeature (f) {
        // pass no argument to return a feature there already
        if (f!== null && !f) {
          return h_coll.getArray()[0];
        }
        // pass arg to set highlight feature
        rx_highlight.onNext(f);
      }

      function subToPeakSelected (ridgevalue) {
        var selected_wkt, selected_f, current_highlight;
        // if there's null, then you should not have highlight
        if (ridgevalue === null) {
          rx_highlight.onNext(null);
        }
        // if remote value exists, we should highlight.
        if (ridgevalue && ridgevalue.hasOwnProperty(0)) {
          scope.roof_peak_chosen = true;
          // validate the button that lets user progress forward
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
          // send the feature to highlight the view
          if (selected_f) {
            // add new highlight
            rx_highlight.onNext(selected_f);
          }
        }
      }

      function roofpeakMousemove(evt) {
        var pixel = maps.omap.getEventPixel(evt.originalEvent);
        mouseover(pixel);
        function mouseover (pixel) {
          feature = maps.omap.forEachFeatureAtPixel(pixel, function(f, layer) {
            return f;
          });

          if (feature !== highlightFeature() && !scope.roof_peak_chosen) {
            if (highlightFeature()) {
               highlightFeature(null)
             }
             if (feature) {
               highlightFeature(feature);
             }
          }
        }
      }

      function roofpeakMouseclick (evt) {
        var pixel = maps.omap.getEventPixel(evt.originalEvent);
        var target_f = maps.omap.forEachFeatureAtPixel(pixel, function(f, layer) {
          return f;
        });
        var testLineString, arrayOfPoints;
        if (target_f &&
            AreaService.getWkt(target_f).split('POLYGON').length === 1) {  //this second condition covers if a polygon was selected
          // console.log(AreaService.getWkt(target_f));

          testLineString = AreaService.getWkt(target_f).split('LINESTRING');
          arrayOfPoints = [];
          if (testLineString.length === 1) { //then we have a point
            arrayOfPoints = AreaService.getWkt(target_f).split('POINT')[1].replace('(', '').replace(')', '').split('TRAVIS');
          }
          else {  //we have a line!
            arrayOfPoints = AreaService.getWkt(target_f).split('LINESTRING')[1].replace('(', '').replace(')', '').split(',');
          }
          Design.ref().child('areas').child('0').child('ridge').set(arrayOfPoints);
          Design.ref().child('areas').child('0').child('tilt').set(maps.gmap.getTilt());

          highlightFeature(target_f);
          scope.roof_peak_chosen = true;
          // scope.$apply()
        } else {
          // console.log('can\'t proceed if you don\'t click a roofpeak, brah');
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
