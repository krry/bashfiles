angular.module('flannel').service('Panelfill', PanelfillSvc);

function PanelfillSvc ($http, $q) {
  // this Service provides Api access
  var Panelfill = {};

  // open to the web
  // var baseUrl = "http://scexchange.solarcity.com/scfilefactory/testfill.aspx";
  // only avail inhouse
  var baseUrl = "http://slc3web00/scexchangestaging/testfill.aspx";

  var points_for_panelfill,
      points_array,
      area_message,
      msg;


  Panelfill.getFilled = function(wkt_txt) {
    var deferred = $q.defer();
    var x = {};

    // turn text into polygon message
    // wkt_txt = 'POLYGON((-122.39737428229726 37.75635781957059,-122.39735416572965 37.75610971523671,-122.39714093011297 37.75611910296826,-122.39715866974932 37.756259541756016,-122.39717311662115 37.75637391282468,-122.39737428229726 37.75635781957059))';
    debugger;
    points_for_panelfill = fillMessageForSingleArea(wkt_txt)['m'][0]; //HACK: reused code
    function fillMessageForSingleArea(wkt_txt){
      var result = {};
      // add area points object
      result.m = {};
      var id = parseInt(0);
      result.m[id] = wkt_txt.split(',');
      result.m[id][0] = result.m[id][0].split('((')[1];
      result.m[id].splice(-1); // remove the last point, it's a dupe of the 1st
      return result;
    };
    // then put the points into an array
    points = convertPolyPointsToArrayOfPoints(points_for_panelfill);
    function convertPolyPointsToArrayOfPoints(poly_points){
      // poly_points === ["coordsA1 coordsB1", "coordsA2 coordsB2"];
      var result = [];
      for (var i in poly_points) {
        result.push(poly_points[i].split(' '));
      }
      return result;
    };

    area = {
      id: 0,
      pitch: 0,
      points: points
    };
    var msg = {}
    msg.m = [area]; // this can be an array of areas
    msg.o = [];             // likewise, this can be obstruction_aray


    x = JSON.stringify(msg);
    $.ajax({
      type: "POST",
      url: baseUrl,
      data: {
         "TestJSON": x
      },
      success: function(dt){
        var t = JSON.parse(dt);
        panelfill_points = t[0]; // HACK: ignoring setbacks that come with this message
        // array_of_features = makePanelsWithApiResponse(panelfill_points);
        console.debug('successful panelfill response', panelfill_points);
        deferred.resolve(panelfill_points);
      }
    });



    //
    // function makePanelsWithApiResponse(data){
    //   var featurestoadd = [];
    //   var responseIterator = function(points){
    //     // iterate over each panel in the array of panels
    //     var feature = panelFromJson(points);
    //     featurestoadd.push(feature);
    //   };
    //   angular.forEach(data, responseIterator);
    //   return featurestoadd;
    // };


    // function panelFromJson(array_of_points){
    //   var feature_to_return;
    //   var pts = array_of_points;
    //
    //   function pointJoin(pointCoordLngLat){
    //     return pointCoordLngLat.join(' ');
    //   }
    //   // create a string with the proper start and end
    //   var wkt_string_from_points_array = [
    //       pointJoin(pts[0]),
    //       pointJoin(pts[1]),
    //       pointJoin(pts[2]),
    //       pointJoin(pts[3]),
    //       pointJoin(pts[0]),
    //   ].join(', ');
    //
    //   // add the right begin & end details
    //   wkt_string_from_points_array = "POLYGON((" + wkt_string_from_points_array + "))";
    //
    //   feature_to_return = wkt.readFeature(wkt_string_from_points_array);
    //   var fGeometry     = wkt.readGeometry(wkt_string_from_points_array);
    //
    //   feature_to_return.set('panel', fGeometry)
    //   feature_to_return.setGeometryName('panel');
    //   return feature_to_return;
    // };


    return deferred.promise;
  };

  return Panelfill;
}


/*
    x = JSON.stringify(msg);
    $.ajax({
      type: "POST",
      url: baseUrl,
      data: {
         "TestJSON": x
      },
      success: function(dt){
        var t = JSON.parse(dt);
        panelfill_points = t[0]; // HACK: ignoring setbacks that come with this message
        array_of_features = makePanelsWithApiResponse(panelfill_points);
        deferred.resolve(array_of_features);
      }
    });




    function makePanelsWithApiResponse(data){
      var featurestoadd = [];
      var responseIterator = function(points){
        // iterate over each panel in the array of panels
        var feature = panelFromJson(points);
        featurestoadd.push(feature);
      };
      angular.forEach(data, responseIterator);
      return featurestoadd;
    };


    function panelFromJson(array_of_points){
      var feature_to_return;
      var pts = array_of_points;

      function pointJoin(pointCoordLngLat){
        return pointCoordLngLat.join(' ');
      }
      // create a string with the proper start and end
      var wkt_string_from_points_array = [
          pointJoin(pts[0]),
          pointJoin(pts[1]),
          pointJoin(pts[2]),
          pointJoin(pts[3]),
          pointJoin(pts[0]),
      ].join(', ');

      // add the right begin & end details
      wkt_string_from_points_array = "POLYGON((" + wkt_string_from_points_array + "))";

      feature_to_return = wkt.readFeature(wkt_string_from_points_array);
      var fGeometry     = wkt.readGeometry(wkt_string_from_points_array);

      feature_to_return.set('panel', fGeometry)
      feature_to_return.setGeometryName('panel');
      return feature_to_return;
    };


    return deferred.promise;
  };

  return Panelfill;

*/
