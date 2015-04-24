angular.module('flannel').factory('StyleService', ['$q', StyleService_]);

function StyleService_ ($q) {
  // this factory provides styles, etc for edlOlMap features
  /* jshint +W069 */  // ignore [bracket notation] through file
  var StyleService = {};
  var colors = {};
  var c = colors;

  StyleService.colors = c;

  /*********************** size configs ***********************/
  c.midpointRadius      = 10;
  c.midpointOuterStroke = 8;
  c.endpointRadius      = 8;
  c.endpointOuterStroke = 2;
  c.lineSegmentWidth = 5;

  /*********************** common colors ***********************/
  c.$brand_fire                 = "rgba(240, 105, 083, 1.0)"; // $brand-fire
  c.$brand_fire_thirty          = "rgba(240, 105, 083, 0.3)"; // $brand-fire 30%
  c.$brand_white                = "rgba(255, 255, 255, 1.0)"; // white
  c.$brand_black                = "rgba(0, 0, 0, 1.0)"; // not white

  // fill
  c.brandFireFill    = new ol.style.Fill({
    color: c.$brand_fire_thirty,
  });

  c.whiteFill    = new ol.style.Fill({
    color: c.$brand_white,
  });

  // polygon line strokes
  c.brandFireStroke_2px =  new ol.style.Stroke({
    color: c.$brand_fire,
    width: 2
  })

  c.brandFireStroke_5px    = new ol.style.Stroke({
    color: c.$brand_fire,
    width: 5
  });

  c.blackStroke_5px    = new ol.style.Stroke({
    color: c.$brand_black,
    width: 5
  });

  c.blackStroke_2px = new ol.style.Stroke({
    color: c.$brand_black,
    width: 2
  })

  c.whiteStroke_2px = new ol.style.Stroke({
    color: c.$brand_white,
    width: 2
  })

  /*********************** roofpeak***********************/
  c.roofpeakSegment      = new ol.style.Style({
    stroke: new ol.style.Stroke({
      color: c.$brand_black,
      width: c.lineSegmentWidth
    })
  });
  c.roofpeakHighlightSegment = new ol.style.Style({
    stroke: new ol.style.Stroke({
      color: c.$brand_fire,
      width: c.lineSegmentWidth
    }),
  })
  c.roofpeakNode = new ol.style.Circle({
    radius: c.endpointRadius,
    fill: c.whiteFill,
    stroke: c.blackStroke_2px,
  })
  c.roofpeakHighlightNode = new ol.style.Circle({
    radius: c.endpointRadius,
    fill: c.whiteFill,
    stroke: c.brandFireStroke_2px,
  })

  /******************** custom styling functions *******/
  function segmentEndpointCoords (feature) {
    // return the coordinates of the endpoints
    var coordinates = feature.getGeometry().getCoordinates();
    return new ol.geom.MultiPoint(coordinates);
  }

  function modifyEndpointCoords (feature) {
    // return the coordinates of the endpoints
    var coordinates = feature.getGeometry().getCoordinates()[0];
    return new ol.geom.MultiPoint(coordinates);
  }

  function modifyMidpointCoords (feature) {
    // return the coordinates of the first ring of the polygon
    var corners = feature.getGeometry().getCoordinates()[0];
    var midpoints = [];
    var x, y;
    for (var i = 0, len = corners.length-1; i < len; i++) {
      x = corners[i+1][0] + corners[i][0];
      y = corners[i+1][1] + corners[i][1];
      midpoints.push([x/2, y/2]);
    }
    return new ol.geom.MultiPoint(midpoints);
  }

  /******************************************************/

  StyleService.remapHighlight = (function() {

    var styles = {};

    styles['segment'] =  [
      // segment styling
      c.roofpeakHighlightSegment,
      // segment endpoint styling
      new ol.style.Style({
        image: c.roofpeakHighlightNode,
        geometry: segmentEndpointCoords,
      })
    ];

    styles['corner'] =  [
      new ol.style.Style({
        image: c.roofpeakHighlightNode,
      })

    ];

    return function(feature, resolution) {
      return styles[feature.getGeometryName()];
    };

  })();
  StyleService.remap = (function() {

    var styles = {};

    styles['segment'] = [c.roofpeakSegment];

    styles['corner'] = [
      new ol.style.Style({
        image: c.roofpeakNode,
      })
    ];

    return function(feature, resolution) {
      return styles[feature.getGeometryName()];
    };
  })();

  StyleService.defaultStyleFunction = (function() {
    var styles = {};

    styles['area'] = [new ol.style.Style({
              fill: c.brandFireFill,
              stroke: c.brandFireStroke_5px,
            })];

    return function(feature, resolution) {
      var radius = feature.get('radius');
      if (feature.getGeometryName()==='obstruction') {
        return styles[feature.getGeometryName()](radius, resolution);
      }
      return styles[feature.getGeometryName()];
    };

  })();


  StyleService.highlightStyleFunction = (function() {

    var styles = {};
    styles['area'] = [
      /* We are using two different styles for the polygons:
       *  - The first style is for the polygons themselves.
       *  - The second style is to draw the vertices of the polygons.
       *    In a custom `geometry` function the vertices of a polygon are
       *    returned as `MultiPoint` geometry, which will be used to render
       *    the style.
       */
      // segment styling
      c.roofpeakHighlightSegment,
      // segment endpoint styling
      new ol.style.Style({
        image: new ol.style.Circle({
          radius: 5,
          fill: c.whiteFill,
          stroke: c.brandFireStroke_2px,
        }),
        geometry: modifyEndpointCoords
      }),
      // segment midpoints styling
      new ol.style.Style({
        image: new ol.style.Circle({
          radius: 3,
          fill: c.whiteFill,
        }),
        geometry: modifyMidpointCoords
      })
    ];

    return function(feature, resolution) {
      var radius = feature.get('radius');
      if (radius) {
        return styles[feature.getGeometryName()](radius, resolution);
      }
      return styles[feature.getGeometryName()];
    };
  })();

  return StyleService;
}
/* jshint -W069 */
