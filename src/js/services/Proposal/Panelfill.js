angular.module('flannel').service('Panelfill', ['$http', '$q', 'PANEL_FILL_API', PanelfillService_]);

function PanelfillService_ ($http, $q, PANEL_FILL_API) {
  // TODO: Revisit naming of this and Proposal service... to whatever it should be.

  // this Service provides API access
  var Panelfill = {};

  // open to the web
  // var baseUrl = "http://scexchange.solarcity.com/scfilefactory/testfill.aspx";
  // only avail inhouse
  //var baseUrl = "http://slc3web00/scexchange/testfill.aspx";

  var baseUrl = PANEL_FILL_API;

  var EarthRadiusInches = 251107755.9; //250826771.7;
  var ToDegrees = 180 / Math.PI;

  var HalfPi = Math.PI / 2;
  var TwoPi = 2 * Math.PI;
  var Two5Pi = 2.5 * Math.PI;

  var points_for_panelfill,
      points_array,
      area_message,
      msg;

  Panelfill.getFilled = function(wkt_txt, ridge, lat, map_tilt) {
    var deferred = $q.defer();
    var x = {};
      var points, area, points_inches, ridge_points;

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


  ridge_points = convertPolyPointsToArrayOfPoints(ridge);

  if(ridge_points.length === 1)
  {
    ridge_points = [ridge_points[0][0], ridge_points[0][1]];
  }

    function convertPolyPointsToArrayOfPoints(poly_points){
      // poly_points ==== ["coordsA1 coordsB1", "coordsA2 coordsB2"];
      var result = [];
      for (var i in poly_points) {
        result.push(poly_points[i].split(' '));
      }

      return result;
    }

  //points are seperate at this point
  points = getEaveAdjustedPolygon(points, ridge_points);

  //If we dont have a 45 tilt do the offset, we need to change the offset for 45 degree's later
  if( map_tilt != 45)
  {
	points = PanelMover3(points, lat);
  }
  else
  {
	points = PanelMover45(points, lat);
  }

  var new_points = points;

  points_inches = convertPointsToPointInches(points, points);
  if( map_tilt == 45)
  {


  var azimuth = Math.atan2((points_inches[1][0] - points_inches[0][0]), (points_inches[1][1] - points_inches[0][1]));

  var center_point = [(points_inches[1][0] + points_inches[0][0]) / 2, (points_inches[1][1] + points_inches[0][1]) / 2];

  center_point[0] = center_point[0] + Math.cos(azimuth) * 7;
  center_point[1] = center_point[1] + Math.sin(azimuth) * 7;

  azimuth = azimuth*180/Math.PI;
    azimuth = (azimuth+450)%360;


  if(PointInPolygon(center_point, points_inches))
  {
    azimuth = (azimuth+180)%360;
  }

  function PointInPolygon(_Pt, _Pts)
  {
    if (_Pts.length < 3)
      return false;

    var Pt1, Pt2;
    var inside = false;

    var oldPoint = [_Pts[_Pts.length - 1][0], _Pts[_Pts.length - 1][1], 0];

    for (var i = 0; i < _Pts.length; i++)
    {
      var newPoint = [_Pts[i][0], _Pts[i][1], 0];
      if (newPoint[0] > oldPoint[0])
      {
        Pt1 = oldPoint;
        Pt2 = newPoint;
      }
      else
      {
        Pt1 = newPoint;
        Pt2 = oldPoint;
      }

      if ((newPoint[0] < _Pt[0]) === (_Pt[0] <= oldPoint[0])
        && (_Pt[1] - Pt1[1]) * (Pt2[0] - Pt1[0]) <
        (Pt2[1] - Pt1[1]) * (_Pt[0] - Pt1[0]))
      {
        inside = !inside;
      }
      oldPoint = newPoint;
    }

    return inside;
  }


  var pitchS = 15;
  var heading = 0;
  var offset = Math.sin(pitchS * Math.PI/180);
  offset = offset  * (Math.abs(Math.sin((azimuth - (heading%180))*Math.PI/180)) * 0.5 + 0.55);

  if(Math.abs(Math.abs(azimuth - 180) - heading%180) < 20)
  {
    offset = offset + 0.10;
  }

  var x = 0;
  var y = -1;

  var b = points_inches[0][0] - points_inches[1][0];
    var a = points_inches[0][1] - points_inches[1][1];
    var c = b * points_inches[0][1] - a * points_inches[0][0];
    b = -b;
    var a2 = a * a;
    var b2 = b * b;
  var offset_poly = [];
  offset_poly.push([points_inches[0][0], points_inches[0][1], 0]);
  offset_poly.push([points_inches[1][0], points_inches[1][1], 0]);

  for(var i = 2; i < points_inches.length; i++)
  {
      //calc distance
      var pt = points_inches[i];
      var d = Math.abs(a * points_inches[i][0] + b * points_inches[i][1] + c) / Math.sqrt(a2+b2);

      var dx = d * x * offset;
      var dy = d * y * offset;

      pt = [points_inches[i][0] + dx, points_inches[i][1]+ dy, 0];
      offset_poly.push(pt);
    }


  new_points = [];
  for (var i in offset_poly)
  {
    new_points.push(CovertPtLngLat(points[0][0], points[0][1], offset_poly[i]));
  }

  //points = new_points;

  }

    area = {
      id: 0,
      pitch: 15,
      points: new_points
    };
    var msg = {};
    msg.m = [area]; // this can be an array of areas
    msg.o = [];     // likewise, this can be obstruction_array


    x = JSON.stringify(msg);
    $.ajax({
      type: "GET",
      url: baseUrl,
      data: {
         "_JSON": x
      },
      success: function(dt){
        var panelfill_points;
        var t = JSON.parse(dt);
        panelfill_points = t[0]; // HACK: ignoring setbacks that come with this message
		//panelfill_points.push(new_points); // test code for panel layout
		if( map_tilt == 45)
	    {
			panelfill_points = PanelMover(points, panelfill_points, points_inches, offset);
		}
        deferred.resolve(panelfill_points);
      }
    });
    return deferred.promise;
  };

  function GetBearing(_FromLng, _FromLat, _ToLng, _ToLat)
  {
    var RadLat1 = _FromLat / ToDegrees;
    var RadLat2 = _ToLat / ToDegrees;
    var RadLng1 = _FromLng / ToDegrees;
    var RadLng2 = _ToLng / ToDegrees;

    var y = Math.sin(RadLng2 - RadLng1) * Math.cos(RadLat2);
    var x = Math.cos(RadLat1) * Math.sin(RadLat2) - Math.sin(RadLat1) * Math.cos(RadLat2) * Math.cos(RadLng2 - RadLng1);

    return Math.atan2(y, x);
  }

  function GetDistance(_FromLng, _FromLat, _ToLng, _ToLat)
  {
    var RadLat1 = _FromLat / ToDegrees;
    var RadLat2 = _ToLat / ToDegrees;
    var dRadLat = Math.sin((_ToLat - _FromLat) / ToDegrees / 2);
    var dRadLon = Math.sin((_ToLng - _FromLng) / ToDegrees / 2);

    var a = dRadLat * dRadLat + Math.cos(RadLat1) * Math.cos(RadLat2) * dRadLon * dRadLon;

    return EarthRadiusInches * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  }

  function convertPointsToPointInches(from_points, to_points) {
    var result = [];


    //GetBearing(_FromLng, _FromLat, _ToLng, _ToLat)

    var _FromLng, _FromLat, _ToLng, _ToLat;

    _FromLng = from_points[0][0];
    _FromLat = from_points[0][1];

    for (var i in to_points) {

      _ToLng = to_points[i][0];
      _ToLat = to_points[i][1];

      var Bearing = Two5Pi - GetBearing(_FromLng, _FromLat, _ToLng, _ToLat);
      var Distance = GetDistance(_FromLng, _FromLat, _ToLng, _ToLat);

      result.push([Math.cos(Bearing) * Distance, Math.sin(Bearing) * Distance])

    }
    return result;
  }

  function CovertPtLngLat(_FromLng, _FromLat, _Pt) {


    var RadLng = _FromLng / ToDegrees;
    var RadLat = _FromLat / ToDegrees;

    var Bearing = Two5Pi - Math.atan2(_Pt[1], _Pt[0]);
    var Distance = Math.sqrt(_Pt[0] * _Pt[0] + _Pt[1] * _Pt[1]) / EarthRadiusInches;

    var temp1 = Math.asin(Math.sin(RadLat) * Math.cos(Distance) + Math.cos(RadLat) * Math.sin(Distance) * Math.cos(Bearing));
    var temp0 = RadLng + Math.atan2(Math.sin(Bearing) * Math.sin(Distance) * Math.cos(RadLat), Math.cos(Distance) - Math.sin(RadLat) * Math.sin(temp1));
    return [temp0 * ToDegrees, temp1 * ToDegrees];
  }

  function PanelMover(points_temp, panelfill_points_temp, points_inches_temp, offset_temp)
  {

    var panelfill_points_inches = [];
    for (var i in panelfill_points_temp) {
      panelfill_points_inches.push(convertPointsToPointInches(points_temp, panelfill_points_temp[i]));
    }

    var x = 0;
    var y = 1;

    var b = points_inches_temp[0][0] - points_inches_temp[1][0];
    var a = points_inches_temp[0][1] - points_inches_temp[1][1];
    var c = b * points_inches_temp[0][1] - a * points_inches_temp[0][0];
    b = -b;
    var a2 = a * a;
    var b2 = b * b;
    var offset_poly = [];
    //offset_poly.push([points_inches[0][0], points_inches[0][1], 0]);
    //offset_poly.push([points_inches[1][0], points_inches[1][1], 0]);
    //Math.Tan(45)
    var offset = .375;


    for (var i in panelfill_points_inches) {

      var offset_panel_poly = [];
      for (var j in panelfill_points_inches[i]) {

        //calc distance
        var pt = panelfill_points_inches[i][j];
        var d = Math.abs(a * panelfill_points_inches[i][j][0] + b * panelfill_points_inches[i][j][1] + c) / Math.sqrt(a2+b2);

        var dx = d * x * offset;
        var dy = d * y * offset;


        pt = [panelfill_points_inches[i][j][0] + dx, panelfill_points_inches[i][j][1]+ dy, 0];
        offset_panel_poly.push(pt);
      }
      offset_poly.push(offset_panel_poly);
    }


    var new_panelfill_points = [];

    for (var i in offset_poly)
    {
      var new_panelfill_panels = [];
      for(var j in offset_poly[i])
      {
        new_panelfill_panels.push(CovertPtLngLat(points_temp[0][0], points_temp[0][1], offset_poly[i][j]));
      }
      new_panelfill_points.push(new_panelfill_panels);
    }
    return new_panelfill_points;
  }

  function PanelMover3(points, lat)
  {

    var new_points = [];
	offset = 0.15; //0.0000015
	for(var i = 0; i < points.length; i++) {
		var brng = GetBearing(points[i][0], points[i][1], points[i][0], lat);
		var d = offset*GetDistance(points[i][0], points[i][1], points[i][0], lat); //GetDistance(_FromLng, _FromLat, _ToLng, _ToLat)
		var φ2 = Math.asin( Math.sin(points[i][1]/ToDegrees)*Math.cos(d/EarthRadiusInches) + Math.cos(points[i][1]/ToDegrees)*Math.sin(d/EarthRadiusInches )*Math.cos(brng));
		new_points.push([points[i][0],φ2*ToDegrees]); //points[i][1]-(d*offset*lat)]);
	}

	return new_points;

  }

    function PanelMover45(points, lat)
  {
  
    var new_points = [];
	offset = 0.15; //0.0000015
	for(var i = 0; i < points.length; i++) {
		var brng = GetBearing(points[i][0], points[i][1], points[i][0], lat);
		var d = offset*GetDistance(points[i][0], points[i][1], points[i][0], lat); //GetDistance(_FromLng, _FromLat, _ToLng, _ToLat)
		var φ2 = Math.asin( Math.sin(points[i][1]/ToDegrees)*Math.cos(d/EarthRadiusInches) - Math.cos(points[i][1]/ToDegrees)*Math.sin(d/EarthRadiusInches )*Math.cos(brng));
		new_points.push([points[i][0],φ2*ToDegrees]); //points[i][1]-(d*offset*lat)]);
	}
  
	return new_points;
  
  }
  

function getEaveAdjustedPolygon(arrayOfPoints,
                highestElement) {


                //TEST AREA
                //test of square
                //arrayOfPoints = [[0,0],[730.330788982676,455.797154688476],[577.308775305942,639.868448125784],[222.577038096253,403.204530504002]];
                //test of triangle
                //arrayOfPoints = [[0,0],[730.330788982676,455.797154688476],[577.308775305942,639.868448125784]];

                //test of line
                //highestElement = [[0,0],[730.330788982676,455.797154688476]];
                //test of point
                //highestElement = [577.308775305942, 639.868448125784];
                //highestElement = [0,0];
                //highestElement = [[0,0],[730.330788982676,455.797154688476]];

                //create a full polygon of adjusted array points
                var adjustedArrayOfPoints = [];

                for (var i = 0; i < arrayOfPoints.length; i ++) {
                                adjustedArrayOfPoints.push(convertToElementToPoint(arrayOfPoints[i], i));
                }
                adjustedArrayOfPoints.push(convertToElementToPoint(arrayOfPoints[0], i)); //add an extra one to the end so we can make our lines quickly

                var adjustedArrayOfLines = [];  //this will rep
                for (var i = 0; i < adjustedArrayOfPoints.length - 1; i ++) {
                                adjustedArrayOfLines.push(convertPointsToLine(adjustedArrayOfPoints[i], adjustedArrayOfPoints[i+1], i));
                }

                //original Polygon
                //don't think we need this for this round
                /*var oldPolygon = {
        Lines: adjustedArrayOfLines,
        Points: adjustedArrayOfPoints,
        ID: 'op1',
    };*/

    var highestPoint = null;

    var highestElementIsALine = false;
    if (highestElement[0].length === 2) {
                highestElementIsALine = true;
    }

                //In the instance that we have a line, then we know that we are going to have two points
                if (highestElementIsALine) {
                                //TODO: THIS isn't working properly yet, but it doesn't really matter since it won't be used...
                                var tempPt1 = convertToElementToPoint(highestElement[0]);
                                var tempPt2 = convertToElementToPoint(highestElement[1]);
                                var tempLine = convertPointsToLine(tempPt1, tempPt2, 'convertedPoint');
								var bigTempPt1 = MakeLineBigger(tempPt1, tempLine, 2000, 0.0005) 
								var bigTempPt2 = MakeLineBigger(tempPt2, tempLine, 2001, -0.0005) 
								
                                highestPoint = GetMidPoint(tempLine);
                }
                else {
                                highestPoint = convertToElementToPoint(highestElement);
                }

                //now we have our polygon (oldPolygon) and our highestPoint (highestElement), we want to determine which lines CANNOT be potential eaves

                var eaveLine = null;
                //let's first add a check if the polygon is 4 vertices (this means we have a triangle)
                if (adjustedArrayOfLines.length === 3) {
                                //We have a triangle, this means one of two things, either they selected a peak and the remaining line is the eave, or they selected a line, and no eave exists
                                //(in this case we will just add a tiny eave.)

                                if (highestElementIsALine) {
                                                //then we have a line, we'll need to add an eave inbetween the two poitns that are not part of the current line

                                                //find the index to insert the line
                                                var indexOfHighestLine = 0;

                                                for (var i = 0; i < adjustedArrayOfLines.length; i++) {
                                                                if (((adjustedArrayOfLines[i].Start.X === highestElement[0][0] && adjustedArrayOfLines[i].Start.Y === highestElement[0][1])  &&
                                                                                (adjustedArrayOfLines[i].End.X === highestElement[1][0] && adjustedArrayOfLines[i].End.Y === highestElement[1][1])) ||
                                                                                ((adjustedArrayOfLines[i].End.X === highestElement[0][0] && adjustedArrayOfLines[i].End.Y === highestElement[0][1])  ||
                                                                                (adjustedArrayOfLines[i].Start.X === highestElement[1][0] && adjustedArrayOfLines[i].Start.Y === highestElement[1][1]))) {
                                                                                //this is our index!
                                                                                indexOfHighestLine = i;
                                                                                //exit batman!
                                                                                break;
                                                                }
                                                }

                                                var pointToBuildEave = null;
                                                //Get the point that we will use to build the new eave
                                                for (var i = 0; i < adjustedArrayOfPoints.length; i++) {
                                                                if (adjustedArrayOfPoints[i].ID !== adjustedArrayOfLines[indexOfHighestLine].Start.ID &&
                                                                                adjustedArrayOfPoints[i].ID !== adjustedArrayOfLines[indexOfHighestLine].End.ID) {
                                                                                pointToBuildEave = adjustedArrayOfPoints[i];
                                                                                break;
                                                                }
                                                }

                                                var newOrderedListOfLines = [];

                                                var var0;
                                                var var1;
                                                var var2;

                                                if (indexOfHighestLine === 0) {
                                                                var0 = 0;
                                                                var1 = 1;
                                                                var2 = 2;
                                                }
                                                else if (indexOfHighestLine === 1) {
                                                                var0 = 1;
                                                                var1 = 2;
                                                                var2 = 0;
                                                }
                                                else {
                                                                var0 = 2;
                                                                var1 = 0;
                                                                var2 = 1;
                                                }

                                                var newOrderedListOfLines = [];
                                                newOrderedListOfLines.push(adjustedArrayOfLines[var0]);

                                                //create our new eave
                                                var secondEavePoint = GetNewPoint(pointToBuildEave, adjustedArrayOfLines[indexOfHighestLine], 1000);

                                                var newLine1 = convertPointsToLine(adjustedArrayOfLines[var1].Start, secondEavePoint, 1001);
                                                var newLine2 = convertPointsToLine(secondEavePoint, adjustedArrayOfLines[var1].End, 1002);
                                                eaveLine = newLine2;
                                                newOrderedListOfLines.push(newLine1);
                                                newOrderedListOfLines.push(newLine2);
                                                newOrderedListOfLines.push(adjustedArrayOfLines[var2]);

                                                //HACK: set the eave to the first line
                                                //eaveLine = adjustedArrayOfLines[0];
                                                adjustedArrayOfLines = newOrderedListOfLines;

                                }
                                else{
                                                //we have a single point, therefore it will be easy to determine the eave
                                                for (var i = 0; i < adjustedArrayOfLines.length; i++) {
                                                                //find the line that does not have either the start nor end point with the highestPoint
                                                                if ((adjustedArrayOfLines[i].Start.X === highestPoint.X && adjustedArrayOfLines[i].Start.Y === highestPoint.Y)  ||
                                                                                (adjustedArrayOfLines[i].End.X === highestPoint.X && adjustedArrayOfLines[i].End.Y === highestPoint.Y)) {
                                                                                //This means that the line has either a start point or an end point that equal the highest point, so we will do nothing
                                                                }
                                                                else {
                                                                                //yay!  we found the line
                                                                                eaveLine = adjustedArrayOfLines[i];
                                                                                break;  //exit the loop
                                                                }
                                                }
                                }
                }
                else {
                                var potentialEaves = [];
                                //We don't have a triangle!  horray!
                                if (highestElementIsALine) {
                                                //then we want to eliminate all lines that share any common points with the highest line
                                                for (var i = 0; i < adjustedArrayOfLines.length; i++) {
                                                                //find the line that does not have either the start nor end point with the highestPoint
                                                                if ((adjustedArrayOfLines[i].Start.X === highestElement[0][0] && adjustedArrayOfLines[i].Start.Y === highestElement[0][1])  ||
                                                                                (adjustedArrayOfLines[i].End.X === highestElement[0][0] && adjustedArrayOfLines[i].End.Y === highestElement[0][1]) ||
                                                                                (adjustedArrayOfLines[i].Start.X === highestElement[1][0] && adjustedArrayOfLines[i].Start.Y === highestElement[1][1])  ||
                                                                                (adjustedArrayOfLines[i].End.X === highestElement[1][0] && adjustedArrayOfLines[i].End.Y === highestElement[1][1])) {
                                                                                //do nothing, it's attached
                                                                }
                                                                else {
                                                                                //yay!  we found a potential eave!
                                                                                potentialEaves.push(adjustedArrayOfLines[i]);
                                                                }
                                                }
                                }
                                else {
                                                for (var i = 0; i < adjustedArrayOfLines.length; i++) {
                                                                //find the line that does not have either the start nor end point with the highestPoint
                                                                if ((adjustedArrayOfLines[i].Start.X === highestPoint.X && adjustedArrayOfLines[i].Start.Y === highestPoint.Y)  ||
                                                                                (adjustedArrayOfLines[i].End.X === highestPoint.X && adjustedArrayOfLines[i].End.Y === highestPoint.Y)) {
                                                                                //do nothing, it's attached
                                                                }
                                                                else {
                                                                                //yay!  we found a potential eave!
                                                                                potentialEaves.push(adjustedArrayOfLines[i]);
                                                                }
                                                }
                                }
					
				
								var otemp;
								var maxDistance;
								var pointToBuildEave = null;
								var indexOfHighestLine = 0;

								for (var i = 0; i < potentialEaves.length; i++) {
									if (highestElementIsALine) {
											if(potentialEaves.length > 1) {
											var test = distToSegmentSquared(potentialEaves[i].Start, bigTempPt1, bigTempPt2)
											var currentDistance = sqr(test.Start.X - test.End.X) + sqr(test.Start.Y - test.End.Y)
											var test2 = distToSegmentSquared(potentialEaves[i].End, bigTempPt1, bigTempPt2)
											var currentDistance2 = sqr(test.Start.X - test.End.X) + sqr(test.Start.Y - test.End.Y)
											
											if(currentDistance2 > currentDistance) {
												currentDistance = currentDistance2;
												test = test2;										
											}
											
											
											if(i == 0) {
												maxDistance = currentDistance;
												eaveLine = potentialEaves[i];
												pointToBuildEave = test.Start;
											}
											else {
												if(currentDistance > maxDistance) {
                          maxDistance = currentDistance;
													eaveLine = potentialEaves[i];
													pointToBuildEave = test.Start;													
												}
											
											}
										}
										else
										{
											eaveLine = potentialEaves[i];										
										}
									
									}
									else {									
										var test = distToSegmentSquared(highestPoint, potentialEaves[i].Start, potentialEaves[i].End)
										var angle_temp = angleBetween2Lines(test, potentialEaves[i])
										angle_temp = Math.abs(Math.abs(angle_temp * ToDegrees)-90);
										if(i == 0) {
											eaveLine = potentialEaves[i];
											otemp = angle_temp;
										
										}
										else {
											if (angle_temp < otemp) {
											
												eaveLine = potentialEaves[i];
											
											}
										
										}						
									
									}
								}
	
								if (highestElementIsALine && potentialEaves.length > 1) {
									var newOrderedListOfLines = [];								
								    var index = 0;
									for (var i = 0 ; i < adjustedArrayOfLines.length; i++) {
										if (adjustedArrayOfLines[i].ID === eaveLine.ID) {
											//var secondEavePoint = GetNewPoint(adjustedArrayOfLines[i].Start, tempLine, 1000);
                      var secondEavePoint = GetNewPoint(pointToBuildEave, tempLine, 1000);
											//create our new eave
											var currIndex = i;
											if( (i+1) == adjustedArrayOfLines.length)
											{
												currIndex = 0;											
											}
											else
											{
												currIndex = i+1;
											}
																				
											var newLine1 = convertPointsToLine(adjustedArrayOfLines[i].Start, secondEavePoint, 1001);
											var newLine2 = convertPointsToLine(secondEavePoint, adjustedArrayOfLines[i].End, 1002);
											newOrderedListOfLines.push(newLine1);
											newOrderedListOfLines.push(newLine2);
											eaveLine = newLine1;
									    }
										else
										{
											newOrderedListOfLines.push(adjustedArrayOfLines[i]);
										}
									}
								//HACK: set the eave to the first line
                                adjustedArrayOfLines = newOrderedListOfLines;	
								}
	
                                //Now we have a list of potential eaves, which one is the right one???
                                //LET'S FIND IT!
								if (eaveLine === null) {

                                //attempt 1, just find the longest line.. this will be it 99% of the time
                                var maxLength = null;
                                for (var i = 0; i < potentialEaves.length; i++) {
                                                var lineLength = GetLineDistance(potentialEaves[i]);

                                                if (maxLength === null || maxLength < lineLength) {
                                                                eaveLine = potentialEaves[i];
                                                                maxLength = lineLength;
                                                }
                                }
                                if (eaveLine === null) {
                                                //THIS SHOULD NEVER HAPPEN, BUT WE WANT TO RETURN SOMETHING AND MAKE SURE EAVE IS NOT NULL
                                                eaveLine = adjustedArrayOfLines[0];
                                }
								
								}
								
				}


                //Now we have our eave, we need to find the index of the line within the adjusted array of lines
                var index = 0;
                for (var i = 0 ; i < adjustedArrayOfLines.length; i++) {
                                if (adjustedArrayOfLines[i].ID === eaveLine.ID) {
                                                index = i;
                                                break;
                                }
                }


                var tbr = [];
                //finally, we want to construct a new array of points to return, the start of it will be the index we just saved
                for (var i = 0; i < adjustedArrayOfLines.length; i++) {
                                var currIndex = index + i;
                                //condition for when we get above the top index
                                if (currIndex >= adjustedArrayOfLines.length) {
                                                currIndex = currIndex - adjustedArrayOfLines.length;
                                }

                                //Grab the line at the current index, if i === 0 we want to add the start and the end points
                                var currLine = adjustedArrayOfLines[currIndex];
                                if (i === 0) {
                                                tbr.push([currLine.Start.X, currLine.Start.Y]);
                                                tbr.push([currLine.End.X, currLine.End.Y]);
                                }
                                else {
                                                tbr.push([currLine.End.X, currLine.End.Y]);
                                }
                }

                tbr.pop();

                return tbr;
	}
function convertToElementToPoint(element, count) {
                return {
                                X: element[0],
                                Y: element[1],
                                Z: 0,
                                ID: 'p' + count,
                };
}

function convertPointsToLine(element1, element2, count) {
                //element1 formated like "x.xxxx y.yyyy"
                var newLine = {
        ID: 'L' + count,
        Start: element1,
        End: element2,
    }
                return newLine;
}

function GetMidPoint(line, uid) {
    return {
        X: (line.Start.X + line.End.X) / 2.0,
        Y: (line.Start.Y + line.End.Y) / 2.0,
        Z: 0,
        ID: 'p' + uid,
    };
}

//Returns the length of a line
function GetLineDistance(newLine) {
    var xs = 0;
    var ys = 0;
    var zs = 0;

    xs = newLine.End.X - newLine.Start.X;
    xs = xs * xs;

    ys = newLine.End.Y - newLine.Start.Y;
    ys = ys * ys;

    zs = newLine.End.Z - newLine.Start.Z;
    zs = zs * zs;

    return Math.sqrt(xs + ys + zs);
}

function LineStartToEndRotation(line) {
    return Math.atan((line.Start.Y - line.End.Y) / (line.Start.X - line.End.X));
}

function GetNewPoint(CurrPoint, line, Id) {
                var Distance = 0.00000001;
                var Angle = LineStartToEndRotation(line);
    return {
        X: parseFloat(CurrPoint.X) + Math.cos(Angle) * Distance,
        Y: parseFloat(CurrPoint.Y) + Math.sin(Angle) * Distance,
        Z: 0,
        ID: 'P' + Id,
    };
}

function MakeLineBigger(CurrPoint, line, Id, Distance) {
                var Angle = LineStartToEndRotation(line);
    return {
        X: parseFloat(CurrPoint.X) + Math.cos(Angle) * Distance,
        Y: parseFloat(CurrPoint.Y) + Math.sin(Angle) * Distance,
        Z: 0,
        ID: 'P' + Id,
    };
}


// shortest distance from point to line 
function distToSegment(p, v, w) { 
	return Math.sqrt(distToSegmentSquared(p, v, w)); 
}

function sqr(x) { return x * x }

function dist3(v, w) { return sqr(v.X - w.X) + sqr(v.Y - w.Y) }
function dist2(v, w) { return [v, w]  }

function distToSegmentSquared(p, v, w) {
  var l2 = dist3(v, w);
  if (l2 == 0) return { Start: p, End: v};
  var t =  ((p.X - v.X) * (w.X - v.X) + (p.Y - v.Y) * (w.Y - v.Y)) / l2;
  if (t < 0) return  { Start: p, End: v};
  if (t > 1) return { Start: p, End: w};
  return { Start: p, End: { X: parseFloat(v.X) + parseFloat(t * (w.X - v.X)),
                    Y: parseFloat(v.Y) + parseFloat(t * (w.Y - v.Y)) }};
}
// end functions required shortest distance from point to line

function angleBetween2Lines(line1, line2)
    {
        var angle1 = Math.atan2(line1.Start.Y - line1.End.Y, line1.Start.X - line1.End.X);
		var angle2 = Math.atan2(line2.Start.Y - line2.End.Y, line2.Start.X - line2.End.X);
        return angle1-angle2;
    }


  return Panelfill;


}
