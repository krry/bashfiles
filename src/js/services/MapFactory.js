/**
 * this is an object
 * name: fln_area
 *
 *Ï
 */

angular.module('flannel').factory('MapFactory', ['MapService','StyleService', 'LayerService', MapFactory_]);

function MapFactory_( MapService, StyleService, LayerService ) {

  // TODO:

  // dev hacks //
  var wkt = new ol.format.WKT();

  // end hacks //
  var map;
  var f_collection = new ol.Collection([]);

  var f_source = new ol.source.Vector({
    features: f_collection,
  });

  var f_layer = new ol.layer.Vector({
    source: f_source,
    projection: MapService.getOmap().getView().getProjection(),
    style:  StyleService.remap,
    name: 'roof_area_layer',
  });

  function setTarget (element) {
    // set the map's target to render in browser
    map.setTarget(element);
  }

  var f_overlay = new ol.FeatureOverlay({
        style:  StyleService.remapHighlight,
      });

  function roofArea (ol_map, target_element, feature) {
    var projection = LayerService.getProjection;
    map = new ol.Map({
      view: new ol.View({
        projection: projection,
        center: ol.extent.getCenter(projection.getExtent()),
        zoom: 1,
      }),
      layers: [f_layer],
      overlays: [f_overlay],
      target: target_element,
      interactions: [],
      controls: [],
    });

    remapFeature(map, feature);

    return map;
  }

// control the map

  function remapFeature (map, feature) {
    // get the view...
    var view = map.getView();
    // turn feature into constituent parts
    var feature_parts = deconstructFeat(feature);


    f_source.addFeatures(feature_parts.point);

    f_source.addFeatures(feature_parts.segment);

    map.getView().fitGeometry(
      feature.getGeometry(),
      // get mapsize
      map.getSize(),
      // pad the edges, this is a target for interface optimization
      {
        padding: [35, 35, 35, 35],
      }
    );
  }

// create new features

  function construct (wkt_arr, style_param) {
    // for each on array,

    var feat;
    var txt;
    var result = [];
    if (style_param === "corner") {
      txt = makePointTxt(wkt_arr);
      feat = featFromTxt(txt, "corner");

      result.push(feat);
    } else if (style_param === "segment") {
      txt = makeLineStringTxt(wkt_arr[0], wkt_arr[1]);
      feat = featFromTxt(txt, "segment");

      result.push(feat);
    }

    return result;
  }

  function featFromTxt (wkt_txt, style_param) {
    var feature = wkt.readFeature(wkt_txt);
    var geometry = wkt.readGeometry(wkt_txt);

    feature.set(style_param, geometry);
    feature.setGeometryName(style_param);
    return feature;
  }

  function makePointTxt (pt) {
    var beg = "POINT(";
    var end =  ")";
    var a = beg + pt[0] + ' ' + pt[1] + end;

    return a;
  }

  function makeLineStringTxt (point_a, point_b) {
    var beg = "LINESTRING(";
    var end = ")";
    var a = beg + point_a[0] + ' ' + point_a[1] + ', ' + point_b[0] + ' ' + point_b[1] + end;

    return a;
  }

// deconstruct the feature into its parts

  function deconstructFeat (feature) {

    var wkt_txt = wkt.writeFeature(feature);
    // make points & line segments from the original feature

    var pts_txt_arr = polygonToPoints(wkt_txt);
    var seg_txt_arr = pointsToSegments(pts_txt_arr);




    var points = /* process points */ [];
    var segments = /* process segments */ [];

    points = buildPoints(pts_txt_arr, 'corner');
    segments = buildSegments(seg_txt_arr, 'segment');

    function buildPoints (txt_arr, param) {
      var result = [];
      for (var i = 0; i < txt_arr.length; i++) {
        var feature = construct(txt_arr[i], param);
        result.push(feature[0]);
      }

      return result;
    }

    function buildSegments (txt_arr, param) {
      var result = [];
      for (var i = 0; i < txt_arr.length; i++) {
        var feature = construct(txt_arr[i], param);
        result.push(feature[0]);
      }

      return result;
    }



    return {
      point: points,
      segment: segments,
    }
  }

  function polygonToPoints (wkt_txt) {
    // split & remove element "))"
    wkt_txt = wkt_txt.split('))')[0]
    // split & remove element before "(("
    wkt_txt = wkt_txt.split('((')[1]
    // new array split on ","
    var wkt_string = wkt_txt.split(',')
    // create points
    var pts_arr = []
    for (var i = 0; i < wkt_string.length; i++ ){
      var pt = wkt_string[i].split(' ')
      pts_arr.push(pt);
    }
    return pts_arr;
  }

  function pointsToSegments (pts_arr) {
    var segments = [];
    for (var i = 0; i< pts_arr.length; i++) {
      var segment;
      if (i === pts_arr.length-1) {
        // combine pts_arr[i] with pts_arr[0]
        segment = [pts_arr[i], pts_arr[0]];
      } else {
        // combine pts_arr[i] with pts_arr[i+1]
        segment = [pts_arr[i], pts_arr[i+1]];
      }
      segments.push(segment);
    }
    return segments;
  }


  return {
    roofArea: roofArea,
  }

}
