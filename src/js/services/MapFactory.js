/**
 * this is an object
 * name: fln_area
 *
 *
 */

angular.module('flannel').factory('MapFactory', ['$rootScope','MapService', 'StyleService', 'Design', 'Clientstream', 'AreaService', 'Layers', MapFactory_]);

function MapFactory_($rootScope, MapService, StyleService, Design, Client , AreaService, Layers) {

  var map,
      f_collection,
      f_source,
      f_overlay,
      f_layer;

  f_overlay    = Design.r_overlay;
  f_source     = Design.roofpeak_source;
  f_layer      = Layers.r_layer;
  f_collection = new ol.Collection([]);

  Client.listen('roofpeak', function (feature) {
    f_source.getFeatures().forEach(function(f) {
      f_source.removeFeature(f);
    })
    // remap the feature
    remapFeature(feature);
  })

  // function roofArea (feature) {

  //   return remapFeature(feature);
  // }

  function remapFeature (feature) {
    if (!feature) {
      return Client.listen('areas in collection', function function_name (f) {
        remapFeature(f);
      })
    }
    var feature_parts = deconstructFeat(feature);
    f_source.addFeatures(feature_parts.point);
    f_source.addFeatures(feature_parts.segment);
  }

// create new features
  function construct (wkt_arr, style_param) {
    // for each on array,
    var feat;
    var txt;
    var result = [];
    if (style_param === "corner") {
      txt = makePointTxt(wkt_arr);
      feat = AreaService.featFromTxt(txt, "corner");

      result.push(feat);
    } else if (style_param === "segment") {
      txt = makeLineStringTxt(wkt_arr[0], wkt_arr[1]);
      feat = AreaService.featFromTxt(txt, "segment");

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

    var wkt_txt = AreaService.getWkt(feature);
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
    };
  }

  function polygonToPoints (wkt_txt) {
    // split & remove element "))"
    wkt_txt = wkt_txt.split('))')[0];
    // split & remove element before "(("
    wkt_txt = wkt_txt.split('((')[1];
    // new array split on ","
    var wkt_string = wkt_txt.split(',');
    // create points
    var pts_arr = [];
    for (var i = 0; i < wkt_string.length; i++ ) {
      var pt = wkt_string[i].split(' ');
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
    // roofArea: roofArea,
    fFromWkt: featFromTxt,
  };

}
