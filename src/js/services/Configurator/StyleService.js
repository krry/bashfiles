angular.module('flannel').factory('StyleService', ['$q', StyleService_]);

function StyleService_ ($q) {
  // this factory provides styles, etc for edlOlMap features

  var StyleService = {};

  var c = {};
  var s = {};

  StyleService.colors = c;
  StyleService.styles = s;

  /*********************** size configs ***********************/
  var node_radius_large       = 8;
  var node_radius_medium      = 5;
  var node_radius_tiny        = 3;
  var thin_stroke_width       = 2;
  var wide_stroke_width       = 5;

  /*********************** common colors ***********************/
  c.$brand_fire                 = "rgba(240, 105, 083, 1.0)"; // $brand-fire
  c.$brand_fire_thirty          = "rgba(240, 105, 083, 0.3)"; // $brand-fire 30%
  c.$brand_white                = "rgba(255, 255, 255, 1.0)"; // white
  c.$brand_black                = "rgba(0, 0, 0, 1.0)";       // not white
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

  s.fill_brand_black  = new ol.style.Fill({
    color: c.$brand_black,
  });

  /* vector stroke */
  s.stroke_thin_brand_fire =  new ol.style.Stroke({
    color: c.$brand_fire,
    width: thin_stroke_width,
  })

  s.stroke_dashed_brand_rain_2px = new ol.style.Stroke({
    color: c.$brand_rain,
    width: thin_stroke_width,
    lineDash: [12,12],
  })

  c.stroke_wide_brand_fire = new ol.style.Stroke({
    color: c.$brand_fire,
    width: wide_stroke_width
  })

  s.stroke_thin_brand_black = new ol.style.Stroke({
    color: c.$brand_black,
    width: thin_stroke_width,
  });

  c.stroke_wide_brand_black      = new ol.style.Stroke({
    color: c.$brand_black,
    width: wide_stroke_width
  });

  c.whiteStroke_2px = new ol.style.Stroke({
    color: c.$brand_white,
    width: thin_stroke_width,
  });

  s.brandRainStroke_2px =  new ol.style.Stroke({
    color: c.$brand_rain,
    width: thin_stroke_width,
  });

  s.stroke_brand_rain_thin = new ol.style.Stroke({
    color: c.$brand_rain,
    width: wide_stroke_width,
  });

  /* vector node */
  s.node_brand_rain = new ol.style.Circle({
    radius: node_radius_medium,
    fill:   s.fill_brand_white,
    stroke: s.brandRainStroke_2px,
  })

  c.node_large_brand_black_outline = new ol.style.Circle({
    radius: node_radius_large,
    fill: s.fill_brand_white,
    stroke: s.stroke_thin_brand_black,
  })

  c.node_large_brand_fire_outline = new ol.style.Circle({
    radius: node_radius_large,
    fill: s.fill_brand_white,
    stroke: s.stroke_thin_brand_fire,
  })

  /* custom geometry styling functions */
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

  function getLineSegmentsFromPolygon (feat) {
    // return the coordinates of the endpoints
    var coordinates = feat.getGeometry().getCoordinates();
    if (feat.getGeometry() instanceof ol.geom.Point || feat.getGeometry() instanceof ol.geom.Polygon) {
      return
    }
    return new ol.geom.LineString(coordinates);
  }

  /** Draw
    a style for the user to see while drawing their polygon.
  */
  StyleService.drawStyle = function drawStyleFunction (feat) {
    var style = {}

    // style applied while tracing
    style.geometry = [

      new ol.style.Style({  // fill styling
        fill: s.fill_brand_rain_thirty,
      }),
      new ol.style.Style({ // dashed line style
        stroke: s.stroke_dashed_brand_rain_2px,
      }),
      new ol.style.Style({ // trace cursor style
        image: s.node_brand_rain,
      }),
      new ol.style.Style({ // style line segments solid
        stroke: s.stroke_brand_rain_thin,
        geometry:   getLineSegmentsFromPolygon,
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
          width: wide_stroke_width,
        }),
      }),
      new ol.style.Style({
        image: s.node_brand_rain,
        geometry: getEndpointsFromPolygon,
        zIndex: Infinity
      })
    ];
    return style[feat.getGeometryName()];
  }

  /** Modify
    a style for the user to see while modifying their polygon.
  */
  StyleService.mouseModifyStyle = [
    new ol.style.Style({
      image: new ol.style.Circle({
        radius: node_radius_medium,
        fill: new ol.style.Fill({
          color: c.$brand_black
        }),
        stroke: s.stroke_thin_brand_fire,
      }),
      zIndex: Infinity
    })
  ];

  /* We are using three different styles for the polygons:
   *  - The first style is for the segments,
   *  - The second are the larger endpoints,
   *  - The third style is to draw the midpoints
   *    In a custom `geometry` function the vertices of a polygon are
   *    returned as `MultiPoint` geometry, which will be used to render
   *    the style.
   */
  StyleService.modifyOverlayStyle = [
    new ol.style.Style({  // segment styling
      stroke: c.stroke_wide_brand_fire
    }),
    new ol.style.Style({ // fill styling
      fill:    s.fill_brand_fire,
    }),
    new ol.style.Style({  // segment endpoint styling
      image: new ol.style.Circle({
        radius: node_radius_medium,
        fill: s.fill_brand_white,
        stroke: s.stroke_thin_brand_fire,
      }),
      geometry: getEndpointsFromPolygon
    }),
    new ol.style.Style({  // segment midpoints styling
      image: new ol.style.Circle({
        radius: node_radius_tiny,
        fill: s.fill_brand_white,
      }),
      geometry: getPolygonMidpoints,
    })
  ];

  /** Roofpeak
    a style for the user to see while finding their roofpeak
    TODO: switch this to a "select" interaction... or make a smarter style function for transition from segment selection to nodes
  */

  StyleService.roofpeak = function(feature) {
    var styles = {};
    styles.segment = [
      new ol.style.Style({
        stroke: c.stroke_wide_brand_black,
      })
    ];
    styles.corner = [
      new ol.style.Style({
        image: c.node_large_brand_black_outline,
      })
    ];
    return styles[feature.getGeometryName()];
  };

  StyleService.roofpeakHighlight = function(feature) {
    var styles = {};
    styles.segment =  [
      new ol.style.Style({  // segment styling
        stroke: c.stroke_wide_brand_fire
      }),
      new ol.style.Style({  // segment endpoint styling
        image: c.node_large_brand_fire_outline,
        geometry: getLineSegmentEndpoints,
      })
    ];
    styles.corner =  [
      new ol.style.Style({
        image: c.node_large_brand_fire_outline,
      })
    ];
    return styles[feature.getGeometryName()];
  }

  return StyleService;
}
