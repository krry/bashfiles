angular.module('flannel').factory('StyleService', ['$q', StyleService_]);

function StyleService_ ($q) {
  // this factory provides styles, etc for edlOlMap features

  var StyleService = {};
  var colors = {};
  var c = colors;

  StyleService.colors = c;




  /*********************** size configs ***********************/
  c.midpointRadius      = 10;
  c.midpointOuterStroke = 8;
  c.endpointRadius      = 8;
  c.endpointOuterStroke = 2;
  c.lineWidth           = 5;

  /*********************** common colors ***********************/
  // c.highlightOpaque         = "rgba(240, 105, 083, 1.0)"; // main orange
  c.highlightFill           = "rgba(240, 105, 083, 0.3)"; // 30% orange
  c.defaultOpaque           = "rgba(240, 105, 083, 1.0)"; // $brand-fire
  c.defaultFill             = "rgba(240, 105, 083, 0.3)"; // 30% blue
  c.defaultGutter           = "rgba(000, 146, 161, 1.0)"; // gutter blue
  c.highlightGutter         = "rgba(184, 061, 022, 1.0)"; // gutter orange
  c.editFill                = "rgba(255, 255, 255, 1.0)"; // white
  c.editStroke              = "rgba(240, 105, 083, 1.0)"; // white

  /*********************** obstruction ***********************/

  c.brandFireStroke_2px =  new ol.style.Stroke({
    color: c.defaultOpaque,
    width: 2
  })

  c.defaultObstruction    = "rgba(184, 61, 22, 1)";
  c.highlightObstruction  = c.highlightOpaque;

  /*********************** panel fill ***********************/
  c.defaultPanelFill        = new ol.style.Fill({
                                color: "rgba(33, 22, 45, 1)"
                              });
  c.defaultPanelStroke      = new ol.style.Stroke({
                                color: "rgba(0,  66, 99, 1)",
                                width: 2
                              });
  c.highglightPanelFill     = new ol.style.Fill({
                                color: "rgba(41, 49, 69, 0.4)",
                              });
  c.highlightPanelStroke    = new ol.style.Stroke({
                                color: "rgba(223, 215, 191, 0.8)",
                                width: 2
                              });

  /*********************** mount plane ***********************/
  c.defaultMountStroke    = new ol.style.Stroke({
                            color: c.defaultOpaque,
                            width: 5
                          });
  c.highlightMountFill    = new ol.style.Fill({
                            color: c.highlightFill,
                          });
  c.highlightNodeFill     = new ol.style.Fill({
                            color: c.editFill
                          });
  c.highlightNodeStroke   = new ol.style.Stroke({
                            color: c.editStroke,
                            width: 2
                          });
  c.highlightNodeImage   = new ol.style.Circle({
                            radius: 17,
                            fill: c.highlightNodeFill,
                            stroke: c.highlightNodeStroke
                          });
  /*********************** roofpeak***********************/
  c.roofpeakCorner      = null;
  c.roofpeakSegment      = new ol.style.Style({
    stroke: new ol.style.Stroke({
      color: 'black',
      width: c.lineWidth
    })
  });
  c.roofpeakHighlightSegment = new ol.style.Style({
    stroke: new ol.style.Stroke({
      color: c.defaultOpaque,
      width: c.lineWidth
    }),
    fill: new ol.style.Fill({
      color: 'rgba(240,105,83,0.3)'
    })
  })

  c.roofpeakHighlightCorner      = null;

  /******************** custom styling functions *******/
  function endpointCoords (feature) {
    // return the coordinates of the endpoints
    var coordinates = feature.getGeometry().getCoordinates();
    return new ol.geom.MultiPoint(coordinates);
  }

  function midpointCoords (feature) {
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
    /* jshint -W069 */
    var styles = {};

    styles['segment'] =  [
      // segment styling
      c.roofpeakHighlightSegment,
      // segment endpoint styling
      new ol.style.Style({
        image: new ol.style.Circle({
          radius: c.endpointRadius,
          fill: new ol.style.Fill({
            color: 'white'
          }),
          stroke: c.brandFireStroke_2px,
        }),
        geometry: endpointCoords,
      })
    ];


    styles['corner'] =  [
      new ol.style.Style({
        image: new ol.style.Circle({
          radius: c.endpointRadius,
          fill: new ol.style.Fill({
            color: 'white'
          }),
          stroke: c.brandFireStroke_2px,
        })
      })

    ];

    return function(feature, resolution) {
      return styles[feature.getGeometryName()];
    };
    /* jshint +W069 */
  })();
  StyleService.remap = (function() {
    /* jshint -W069 */
    var styles = {};

    styles['segment'] = [c.roofpeakSegment];

    styles['corner'] = [
      new ol.style.Style({
        image: new ol.style.Circle({
          radius: 5,
          fill: new ol.style.Fill({
            color: 'black'
          })
        })
      }),
      new ol.style.Style({
        image: new ol.style.Circle({
          radius: 3,
          fill: new ol.style.Fill({
            color: 'white'
          })
        })
      })
    ];

    return function(feature, resolution) {
      return styles[feature.getGeometryName()];
    };
    /* jshint +W069 */
  })();

  StyleService.defaultStyleFunction = (function() {
    /* jshint -W069 */
    var styles = {};

    styles['area'] = [new ol.style.Style({
              fill: c.highlightMountFill,
              stroke: c.defaultMountStroke,
              image: c.highlightNodeImage,
            })];

    return function(feature, resolution) {
      var radius = feature.get('radius');
      if (feature.getGeometryName()==='obstruction') {
        return styles[feature.getGeometryName()](radius, resolution);
      }
      return styles[feature.getGeometryName()];
    };
    /* jshint +W069 */
  })();



  StyleService.highlightStyleFunction = (function() {
    /* jshint -W069 */
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
      new ol.style.Style({
        stroke: new ol.style.Stroke({
          color: c.defaultOpaque,
          width: 3
        }),
        fill: new ol.style.Fill({
          color: 'rgba(240,105,83,0.3)'
        })
      }),
      // segment endpoint styling
      new ol.style.Style({
        image: new ol.style.Circle({
          radius: 5,
          fill: new ol.style.Fill({
            color: 'white'
          }),
          stroke: c.brandFireStroke_2px,
        }),
        geometry: function(feature) {
          // return the coordinates of the first ring of the polygon
          var coordinates = feature.getGeometry().getCoordinates()[0];
          return new ol.geom.MultiPoint(coordinates);
        }
      }),
      // segment midpoints styling
      new ol.style.Style({
        image: new ol.style.Circle({
          radius: 3,
          fill: new ol.style.Fill({
            color: 'white'
          }),
          stroke: new ol.style.Stroke({
            color: c.defaultOpaque,
            width: 1
          })
        }),
        geometry: function(feature) {
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
      })
    ];

    /*jshint +W069 */

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
