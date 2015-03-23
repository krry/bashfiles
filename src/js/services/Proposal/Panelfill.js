angular.module('flannel').service('Panelfill', PanelfillSvc);

function PanelfillSvc ($http, $q) {
  // TODO: Revisit naming of this and Proposal service... to whatever it should be. 

  // this Service provides Api access
  var Panelfill = {};

  // open to the web
  // var baseUrl = "http://scexchange.solarcity.com/scfilefactory/testfill.aspx";
  // only avail inhouse
  var baseUrl = "http://slc3web00/scexchange/testfill.aspx";

  var points_for_panelfill,
      points_array,
      area_message,
      msg;

  Panelfill.getFilled = function(wkt_txt) {
    var deferred = $q.defer();
    var x = {};
      var points, area;

    // turn text into polygon message
    points_for_panelfill = fillMessageForSingleArea(wkt_txt).m[0]; //HACK: reused code, ignore obstructions
    function fillMessageForSingleArea(wkt_txt){
      var result = {};

      // add area points object
      result.m = {};
      var id = parseInt(0);
      result.m[id] = wkt_txt.split(',');
      result.m[id][0] = result.m[id][0].split('((')[1];
      result.m[id].splice(-1); // remove the last point, it's a dupe of the 1st
      return result;
    }
    // then put the points into an array
    points = convertPolyPointsToArrayOfPoints(points_for_panelfill);
    function convertPolyPointsToArrayOfPoints(poly_points){
      // poly_points === ["coordsA1 coordsB1", "coordsA2 coordsB2"];
      var result = [];
      for (var i in poly_points) {
        result.push(poly_points[i].split(' '));
      }
      return result;
    }

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
        var panelfill_points;
        var t = JSON.parse(dt);
        panelfill_points = t[0]; // HACK: ignoring setbacks that come with this message
        deferred.resolve(panelfill_points);
      }
    });

    return deferred.promise;
  };

  return Panelfill;
}
