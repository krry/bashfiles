function PanelFillService_ ($q, $window, OlService, MapService, ApiService) {
  // this Service provides styles, etc for edlOlMap features
  var PanelFillService = {};

  // well known text format utility
  wkt = OlService.wkt;

	 /* 
	 * external functions
	 */

  PanelFillService.obstructionDefaultRadius = function() { 
    var conv = PanelFillService.edgesAndRatios();

    var one_feet_degree_latitude_at_35degrees = 305775.35603412613; 
    var radius = (1/one_feet_degree_latitude_at_35degrees ) * conv.px_per_n; 
    return radius * 2; //HACK: this need to be double checked, i think it's broken.
  };

  PanelFillService.edgesAndRatios = function(){ //TODO: refactor to angular provider
		var north_edge, south_edge, east_edge, west_edge, pixelHeight, pixelWidth;
		north_edge = 0;
		west_edge  = 0;
		east_edge  = $window.innerWidth;
		south_edge = OlService.mapDiv.clientHeight;
		pixelWidth = $window.innerWidth;
		pixelHeight = OlService.mapDiv.clientHeight;
		var mapCornerExtent;
		mapCornerExtent = MapService.g.bounds ? MapService.g.bounds : [0, 0, $window.innerWidth, OlService.mapDiv.clientHeight ];
		var pixelExtentXY01 = [0, 0, $window.innerWidth, OlService.mapDiv.clientHeight ];
		var enws_deg_extent = [];
		if (!Array.isArray(mapCornerExtent)) { //TODO: ?? extract this to MapService
			north_edge = mapCornerExtent.getNorthEast().lat();
			south_edge = mapCornerExtent.getSouthWest().lat();
			east_edge  = mapCornerExtent.getNorthEast().lng();
			west_edge  = mapCornerExtent.getSouthWest().lng();
			enws_deg_extent = [
				mapCornerExtent.getNorthEast().lng(), // degX0 east_edge
				mapCornerExtent.getNorthEast().lat(), // degY0 north_edge
				mapCornerExtent.getSouthWest().lng(), // degX1 west_edge
				mapCornerExtent.getSouthWest().lat(), // degY1 south_edge
			];
		} else {
			enws_deg_extent = mapCornerExtent;
		}

		// map measure in degrees
		var e_mapsize = Math.abs(east_edge - west_edge);
		var n_mapsize = Math.abs(north_edge - south_edge);
		var en_mapsize = [e_mapsize, n_mapsize];

		// ratio pixels on map : degrees on map = px/dg
		var px_per_e = pixelWidth  / e_mapsize;
		var px_per_n = pixelHeight / n_mapsize;
		var px_per_en = [px_per_e, px_per_n];

		return {

			n: north_edge,
			s: south_edge,
			e: east_edge,
			w: west_edge,
			px_per_e: px_per_e,
			px_per_n: px_per_n,
			pxHeight: pixelHeight,
		};

  };

  PanelFillService.makePanelsWithApiResponse = function(data, panelid){
		var mapEdges = PanelFillService.edgesAndRatios();
	  var featurestoadd = [];
	  var responseIterator = function(arrayOfPanels, key){
	    // iterate over each panel in the array of panels

	    arrayOfPanels.forEach(function(points_for_panel, key, obj){
	      // turn each array of points into a WKT
	      var feature = PanelFillService.panelFromJson(points_for_panel, mapEdges);
	      featurestoadd.push(feature);
	    	OlService.setIdsOfFeaturearray([feature], panelid);
	    });
	  };
  	angular.forEach(data, responseIterator);
		return featurestoadd;
  };

  PanelFillService.processFeatures = function(mounts, obstructions ){
  	var msg = {};
  	msg.m = [];
  	var pitch;
  	for (var idx in mounts) {
  		var p = [];
  		idx = parseInt(idx);
  		for (var point in mounts[idx]){ 
  			p.push(PanelFillService.pointToLatLng(mounts[idx][point], idx, mounts));
  		}
  		pitch = parseInt(OlService.getSelectedFeature()[0].get('pitch')); //TODO: this only works for for single selection
  		msg.m.push({
					id: idx, 
					pitch: pitch,
					points: p,
					portrait: OlService.getSelectedFeature()[0].get('edl').panelOrientation.chosenValue === "portrait" ? "true": "false",
				});
  	}
  	
  	msg.o = [];
  	for (var ix in obstructions) {
  		var o = [];
  		for (var center in obstructions[ix]){ 
  			o.push(PanelFillService.pointToLatLng(obstructions[ix][center], ix, obstructions));
  		}
  		msg.o.push({
					radius: parseInt(OlService.obstructions.getFeatures()[ix].get('radius')),
					height: 0,
					center: {
						lon: o[0][0],
						lat: o[0][1],
					},
				});
  	}
		return msg;
  };


	PanelFillService.pointToLatLng = function(point_string) {
		//TODO: is it a problem that browser zoom impacts these numbers?

		var mapEdges = PanelFillService.edgesAndRatios();

		var pt_xy	= point_string.split(' ');

		function north_pt(pt_y) {
			return mapEdges.s + pt_y / mapEdges.px_per_n;
		}

		function east_pt(pt_x) {
			return mapEdges.w + pt_x / mapEdges.px_per_e;
		}

		function point_machine(pt_xy){
			return [east_pt(pt_xy[0]), north_pt(pt_xy[1])];
		}

		return point_machine(pt_xy);
  };

  // turn json into WKT ==> POLYGON((159 569,541 576,554 286,193 271,159 569)) 
	PanelFillService.panelFromJson = function(array_of_points, mapEdges){
		var feature_to_return;
		var pts = array_of_points;

		function pointJoin(pointCoordLngLat){
			var pt_e  = pointCoordLngLat[0]; // -122.26724295911637
			var pt_n = pointCoordLngLat[1]; //   37.483464075107776			
			// (en_pt_on_map) * K = new point
			var result = [
				 (pt_e - mapEdges.w ) * mapEdges.px_per_e ,
			   mapEdges.pxHeight - ((mapEdges.n - pt_n) * mapEdges.px_per_n) ,
			].join(' ');

			return result;
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

		feature_to_return.setProperties({
			panel: fGeometry,
		});
		feature_to_return.setGeometryName('panel');
		return feature_to_return;
  };

  return PanelFillService;
}

angular.module('edliter').service('PanelFillService', PanelFillService_);  