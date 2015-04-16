angular.module('flannel').factory('StyleService', ['$q', StyleService_]);

function StyleService_ ($q) {
  // this factory provides styles, etc for edlOlMap features

  var colors = {};
  var c = colors;

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
  c.defaultMountFill      = new ol.style.Fill({
                            color: c.defaultFill,
                          });
  c.defaultMountStroke    = new ol.style.Stroke({
                            color: c.defaultOpaque,
                            width: 5
                          });
  c.defaultMountImage     = new ol.style.Circle({
                            radius: 17,
                            fill: c.defaultMountFill
                          });
  c.highlightMountFill    = new ol.style.Fill({
                            color: c.highlightFill,
                          });
  c.highlightMountStroke  = new ol.style.Stroke({
                            color: c.editStroke,
                            width: 5
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

  /*********************** gutter ***********************/
  c.defaultGutterStroke = new ol.style.Stroke({
                            color: c.defaultGutter,
                            width: 7
                          });
  c.defaultGutterImage  = new ol.style.Circle({
                            radius: 7,
                            fill: new ol.style.Fill({
                              color: c.defaultGutter
                            })
                          });
  c.highlightGutterStroke = new ol.style.Stroke({
                            color: c.highlightGutter,
                            width: 7
                          });
  c.highlightGutterImage  = new ol.style.Circle({
                            radius: 7,
                            fill: new ol.style.Fill({
                              color: c.highlightGutter
                            })
                          });


  var StyleService = {};
  StyleService.colors = c;
  StyleService.remapHighlight = (function() {
    /* jshint -W069 */
    var styles = {};

    styles['segment'] =  [new ol.style.Style({
              stroke: new ol.style.Stroke({
                color: 'black',
                width: 4
              })}),new ol.style.Style({ stroke: new ol.style.Stroke({
                color: 'yellow',
                width: 3
              })})];


    styles['corner'] =  [new ol.style.Style({
              image: new ol.style.Circle({
                radius: 5,
                fill: new ol.style.Fill({
                  color: 'black'
                })
              })
            }), new ol.style.Style({
              image: new ol.style.Circle({
                radius: 3,
                fill: new ol.style.Fill({
                  color: 'yellow'
                })
              })
            })];

    return function(feature, resolution) {
      // var radius = feature.get('radius');
      // if (feature.getGeometryName()==='obstruction') {
      //   return styles[feature.getGeometryName()](radius, resolution);
      // }
      return styles[feature.getGeometryName()];
    };
    /* jshint +W069 */
  })();
  StyleService.remap = (function() {
    /* jshint -W069 */
    var styles = {};

    styles['segment'] = [new ol.style.Style({
      stroke: new ol.style.Stroke({
        color: 'black',
        width: 4
      })
    })];

    styles['corner'] = [new ol.style.Style({
      image: new ol.style.Circle({
        radius: 5,
        fill: new ol.style.Fill({
          color: 'black'
        })
      })
    })];

    return function(feature, resolution) {
      // var radius = feature.get('radius');
      // if (feature.getGeometryName()==='obstruction') {
      //   return styles[feature.getGeometryName()](radius, resolution);
      // }
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

    // styles['gutter'] =  [new ol.style.Style({
    //           stroke: c.defaultGutterStroke,
    //           image:  c.defaultGutterImage,
    //         })];

    // styles['geometry'] =  [new ol.style.Style({
    //           fill: new ol.style.Fill({
    //             color: 'pink'
    //           }),
    //           stroke: new ol.style.Stroke({
    //             color: 'red',
    //             width: 4
    //           }),
    //           image: new ol.style.Circle({
    //             radius: 7,
    //             fill: new ol.style.Fill({
    //               color: 'blue'
    //             })
    //           })
    //         })];
    // styles['panel'] =  [new ol.style.Style({
    //     fill: c.defaultPanelFill,
    //     stroke: c.defaultPanelStroke,
    //     image: new ol.style.Circle({
    //       radius: 7,
    //       fill: new ol.style.Fill({
    //         color: c.highlightOpaque,
    //       })
    //     })
    //   })];

    // // create a separate style function to work with changing radius of obstructions:
    // styles['obstruction'] = function(rad, res) {
    //   return [new ol.style.Style({
    //           stroke: c.defaultPanelStroke,
    //           image: new ol.style.Circle({
    //             radius: rad / (res*4.2) || 0,
    //             fill: new ol.style.Fill({
    //               color: c.defaultObstruction
    //             })
    //           })
    //         })];
    //   };

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
  new ol.style.Style({
    stroke: new ol.style.Stroke({
      color: '#F06953',
      width: 3
    }),
    fill: new ol.style.Fill({
      color: 'rgba(240,105,83,0.3)'
    })
  }),
  new ol.style.Style({
    image: new ol.style.Circle({
      radius: 5,
      fill: new ol.style.Fill({
        color: 'white'
      }),
      stroke: new ol.style.Stroke({
        color: '#F06953',
        width: 2
      })
    }),
    geometry: function(feature) {
      // return the coordinates of the first ring of the polygon
      var coordinates = feature.getGeometry().getCoordinates()[0];
      return new ol.geom.MultiPoint(coordinates);
    }
  }),
  new ol.style.Style({
    image: new ol.style.Circle({
      radius: 3,
      fill: new ol.style.Fill({
        color: 'white'
      }),
      stroke: new ol.style.Stroke({
        color: '#F06953',
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
    // styles['gutter'] =  [new ol.style.Style({
    //           stroke: c.highlightGutterStroke,
    //           image:  c.highlightGutterImage,
    //         })];
    // styles['geometry'] =  [new ol.style.Style({
    //           fill: new ol.style.Fill({
    //             color: c.highlightFill,
    //           }),
    //           stroke: new ol.style.Stroke({
    //             color: c.highlightOpaque,
    //             width: 5
    //           }),
    //           image: new ol.style.Circle({
    //             radius: 7,
    //             fill: new ol.style.Fill({
    //               color: c.highlightOpaque,
    //             })
    //           })
    //         })];
    // styles['panel'] =  [new ol.style.Style({
    //         fill: c.highglightPanelFill,
    //         stroke: c.highlightPanelStroke,
    //         image: new ol.style.Circle({
    //           radius: 7,
    //           fill: new ol.style.Fill({
    //             color: c.highlightOpaque,
    //           })
    //         })
    //       })];
    // // create a separate style function to work with changing radius of obstructions:
    // styles['obstruction'] = function(rad, res) {
    //   return [new ol.style.Style({
    //           stroke: c.highlightPanelStroke,
    //           image: new ol.style.Circle({
    //             radius: rad / (res*4.2),
    //             fill: new ol.style.Fill({
    //               color: c.highlightObstruction
    //             })
    //           })
    //         })];
    //   };

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
