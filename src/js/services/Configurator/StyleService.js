angular.module('flannel').factory('StyleService', ['$q', StyleService_]);

function StyleService_ ($q) {
  // this factory provides styles, etc for edlOlMap features
  /* jshint +W069 */  // ignore [bracket notation] through file
  var StyleService = {};

  var c = {};
  var s = {};

  StyleService.colors = c;
  StyleService.styles = s;

  /*********************** size configs ***********************/
  var endpointNodeRadius     = 8;
  var nodeStrokeWidth        = 2;
  var lineSegmentWidth       = 5;

  /*********************** common colors ***********************/
  c.$brand_fire                 = "rgba(240, 105, 083, 1.0)"; // $brand-fire
  c.$brand_fire_thirty          = "rgba(240, 105, 083, 0.3)"; // $brand-fire 30%
  c.$brand_white                = "rgba(255, 255, 255, 1.0)"; // white
  c.$brand_black                = "rgba(0, 0, 0, 1.0)"; // not white
  c.$brand_rain                 = "rgba(072, 135, 255, 1.0)"; // like blue, but more refined
  c.$brand_rain_thirty          = "rgba(072, 135, 255, 0.3)"; // like blue, 70% less refined

  /* vector fill */

  s.fill_brand_fire = new ol.style.Fill({
    color: c.$brand_fire_thirty,
  });

  s.fill_brand_rain_thirty  = new ol.style.Fill({
         color: c.$brand_rain_thirty,
       })

  s.fill_brand_white  = new ol.style.Fill({
    color: c.$brand_white,
  });

  // line strokes
  s.brandFireLineStroke    = new ol.style.Stroke({
    color: c.$brand_fire,
    width: lineSegmentWidth,
  });

  s.stroke_brand_fire_node =  new ol.style.Stroke({
    color: c.$brand_fire,
    width: nodeStrokeWidth,
  })

  s.stroke_dashed_brand_rain_2px = new ol.style.Stroke({
        color: c.$brand_rain,
    width: nodeStrokeWidth,
    lineDash: [5,5],
  })

  c.blackStroke_2px = new ol.style.Stroke({
    color: c.$brand_black,
    width: nodeStrokeWidth,
  });

  c.whiteStroke_2px = new ol.style.Stroke({
    color: c.$brand_white,
    width: nodeStrokeWidth,
  });

  s.brandRainStroke_2px =  new ol.style.Stroke({
    color: c.$brand_rain,
    width: nodeStrokeWidth,
  });

  s.brandRainStroke_5px = new ol.style.Stroke({
    color: c.$brand_rain,
    width: lineSegmentWidth,
  });

  /*********************** roofpeak***********************/
  c.roofpeakSegment      = new ol.style.Style({
    stroke: new ol.style.Stroke({
      color: c.$brand_black,
      width: lineSegmentWidth
    })
  });
  c.roofpeakHighlightSegment = new ol.style.Style({
    stroke: new ol.style.Stroke({
      color: c.$brand_fire,
      width: lineSegmentWidth
    })
  })
  c.roofpeakNode = new ol.style.Circle({
    radius: endpointNodeRadius,
    fill: s.fill_brand_white,
    stroke: c.blackStroke_2px,
  })
  c.modifyMouseNode = new ol.style.Circle({
    radius: endpointNodeRadius,
    fill: c.blackFill,
    stroke: c.blackStroke_2px,
  })
  c.roofpeakHighlightNode = new ol.style.Circle({
    radius: endpointNodeRadius,
    fill: s.fill_brand_white,
    stroke: s.stroke_brand_fire_node,
  })
  c.modifyEndpoint = c.roofpeakHighlightSegment;

  /******************** custom styling functions *******/
  function getLineSegmentEndpoints (segmentFeature) {
    // return the coordinates of the endpoints
    var coordinates = segmentFeature.getGeometry().getCoordinates();
    return new ol.geom.MultiPoint(coordinates);
  }

  function getEndpointsFromPolygon (polygonFeature) {
    // return the coordinates of the endpoints
    var coordinates = polygonFeature.getGeometry().getCoordinates()[0];
    return new ol.geom.MultiPoint(coordinates);
  }

  function getPolygonMidpoints (polygonFeature) {
    // return the coordinates of the first ring of the polygon
    var corners = polygonFeature.getGeometry().getCoordinates()[0];
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


  /** Draw
    a style for the user to see while drawing their polygon.
  */
  StyleService.drawStyle = function drawStyleFunction (feat) {
    style = {}


    s.node_brand_rain = new ol.style.Circle({
        radius: 5,
        fill:   s.fill_brand_white,
        stroke: s.brandRainStroke_2px,
      })

    s.traceDashedStroke = new ol.style.Style({
        stroke: s.stroke_dashed_brand_rain_2px,
      })

    s.drawStrokeStyle = new ol.style.Style({
         stroke: s.brandRainStroke_5px,
      })



    s.traceCursorStyle = new ol.style.Style({
      image: s.node_brand_rain,
    })


    // style applied while tracing
    style.geometry = [
      // fill styling
      new ol.style.Style({
        fill:s.fill_brand_rain_thirty,
      }),
      // dashed line style
      s.traceDashedStroke,
      // trace cursor style
      s.traceCursorStyle,
      // style line segments solid
      new ol.style.Style({
        stroke: s.brandRainStroke_5px,
        geometry:   function getLineSegmentsFromPolygon (feat) {
          // return the coordinates of the endpoints
          var coordinates = feat.getGeometry().getCoordinates();
          if (feat.getGeometry() instanceof ol.geom.Point || feat.getGeometry() instanceof ol.geom.Polygon) {
            return
          }
          // coordinates.shift();
          console.log(coordinates.length)
          console.log(feat.getGeometry())
          return new ol.geom.LineString(coordinates);
        }
      })
    ]

    // style applied in static draw view
    style.area = [
      new ol.style.Style({
        fill: new ol.style.Fill({
          color: c.$brand_rain_thirty,
        }),
        stroke: new ol.style.Stroke({
          color: c.$brand_rain,
          width: 5,
        }),
      }),
      new ol.style.Style({
        image: s.node_brand_rain,
        geometry: getEndpointsFromPolygon,
        zIndex: Infinity
      })
    ];
    console.log(feat.getGeometryName())
    return style[feat.getGeometryName()];
  }

  StyleService.remapHighlight = (function() {

    var styles = {};

    styles.segment =  [
      // segment styling
      c.roofpeakHighlightSegment,
      // segment endpoint styling
      new ol.style.Style({
        image: c.roofpeakHighlightNode,
        stroke: c.roofpeakHighlightSegment,
        geometry: getLineSegmentEndpoints,
      })
    ];

    styles.corner =  [
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

  StyleService.mouseModifyStyle = [
    new ol.style.Style({
      image: new ol.style.Circle({
        radius: 5,
        fill: new ol.style.Fill({
          color: c.$brand_black
        }),
        stroke: s.stroke_brand_fire_node,
      }),
      zIndex: Infinity
    })
  ];

  StyleService.modifyOverlayStyle = [
    /* We are using three different styles for the polygons:
     *  - The first style is for the segments,
     *  - The second are the larger endpoints,
     *  - The third style is to draw the midpoints
     *    In a custom `geometry` function the vertices of a polygon are
     *    returned as `MultiPoint` geometry, which will be used to render
     *    the style.
     */
    // segment styling
    c.roofpeakHighlightSegment,
    // fill styling,
    new ol.style.Style({
      fill:    s.fill_brand_fire,
    }),

    // segment endpoint styling
    new ol.style.Style({
      image: new ol.style.Circle({
        radius: 5,
        fill: s.fill_brand_white,
        stroke: s.stroke_brand_fire_node,
      }),
      geometry: getEndpointsFromPolygon
    }),
    // segment midpoints styling
    new ol.style.Style({
      image: new ol.style.Circle({
        radius: 3,
        fill: s.fill_brand_white,
      }),
      geometry: getPolygonMidpoints,
    })
  ]

  return StyleService;
}
/* jshint -W069 */
