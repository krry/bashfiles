function StyleService_ ($q) {
  // this factory provides styles, etc for edlOlMap features
  //

  var colors = {};
  var c = colors;

  /*********************** common colors ***********************/
  c.highlightOpaque         = "rgba(251, 127, 61, 1)"; // main orange
  c.highlightFill           = "rgba(251, 127, 61, 0.3)"; // 30% orange
  c.defaultOpaque           = "rgba(0, 166, 183, 1)"; // main blue
  c.defaultFill             = "rgba(0, 166, 183, 0.3)"; // 30% blue
  c.defaultGutter           = "rgba(0, 146, 161, 1)"; // gutter blue
  c.highlightGutter         = "rgba(184, 61, 22, 1)";  // gutter orange

  /*********************** obstruction ***********************/
  c.defaultObstruction    = "rgba(184, 61, 22, 1)";
  c.highlightObstruction  = c.highlightOpaque;

  /*********************** panel fill ***********************/
  c.defaultPanelFill        = new ol.style.Fill({
                                color: "rgba(33, 22, 45, 1)",
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
  c.defaultMountFill    = new ol.style.Fill({
                            color: c.defaultFill,
                          });
  c.defaultMountStroke  = new ol.style.Stroke({
                            color: c.defaultOpaque,
                            width: 5
                          });
  c.defaultMountImage   = new ol.style.Circle({
                            radius: 7,
                            fill: c.defaultMountFill
                          });
  c.highlightMountFill    = new ol.style.Fill({
                            color: c.highlightFill,
                          });
  c.highlightMountStroke  = new ol.style.Stroke({
                            color: c.highlightOpaque,
                            width: 5
                          });
  c.highlightMountImage   = new ol.style.Circle({
                            radius: 7,
                            fill: c.highlightMountFill
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
                width: 25
              })}),new ol.style.Style({ stroke: new ol.style.Stroke({
                color: 'yellow',
                width: 15
              })})];


    styles['corner'] =  [new ol.style.Style({
              image: new ol.style.Circle({
                radius: 45,
                fill: new ol.style.Fill({
                  color: 'black'
                })
              })
            }), new ol.style.Style({
              image: new ol.style.Circle({
                radius: 40,
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

        styles['segment'] =  [new ol.style.Style({
              stroke: new ol.style.Stroke({
                color: 'black',
                width: 25
              })})];


    styles['corner'] =  [new ol.style.Style({
              image: new ol.style.Circle({
                radius: 45,
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
              fill: c.defaultMountFill,
              stroke: c.defaultMountStroke,
              image: c.defaultMountImage,
            })];

    styles['gutter'] =  [new ol.style.Style({
              stroke: c.defaultGutterStroke,
              image:  c.defaultGutterImage,
            })];

    styles['geometry'] =  [new ol.style.Style({
              fill: new ol.style.Fill({
                color: 'pink'
              }),
              stroke: new ol.style.Stroke({
                color: 'red',
                width: 4
              }),
              image: new ol.style.Circle({
                radius: 7,
                fill: new ol.style.Fill({
                  color: 'blue'
                })
              })
            })];
    styles['panel'] =  [new ol.style.Style({
        fill: c.defaultPanelFill,
        stroke: c.defaultPanelStroke,
        image: new ol.style.Circle({
          radius: 7,
          fill: new ol.style.Fill({
            color: c.highlightOpaque,
          })
        })
      })];

    // create a separate style function to work with changing radius of obstructions:
    styles['obstruction'] = function(rad, res) {
      return [new ol.style.Style({
              stroke: c.defaultPanelStroke,
              image: new ol.style.Circle({
                radius: rad / (res*4.2) || 0,
                fill: new ol.style.Fill({
                  color: c.defaultObstruction
                })
              })
            })];
      };

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
    styles['area'] = [new ol.style.Style({
              fill: c.highlightMountFill,
              stroke: c.highlightMountStroke,
              image: c.highlightMountImage,
            })];
    styles['gutter'] =  [new ol.style.Style({
              stroke: c.highlightGutterStroke,
              image:  c.highlightGutterImage,
            })];
    styles['geometry'] =  [new ol.style.Style({
              fill: new ol.style.Fill({
                color: c.highlightFill,
              }),
              stroke: new ol.style.Stroke({
                color: c.highlightOpaque,
                width: 5
              }),
              image: new ol.style.Circle({
                radius: 7,
                fill: new ol.style.Fill({
                  color: c.highlightOpaque,
                })
              })
            })];
    styles['panel'] =  [new ol.style.Style({
            fill: c.highglightPanelFill,
            stroke: c.highlightPanelStroke,
            image: new ol.style.Circle({
              radius: 7,
              fill: new ol.style.Fill({
                color: c.highlightOpaque,
              })
            })
          })];
    // create a separate style function to work with changing radius of obstructions:
    styles['obstruction'] = function(rad, res) {
      return [new ol.style.Style({
              stroke: c.highlightPanelStroke,
              image: new ol.style.Circle({
                radius: rad / (res*4.2),
                fill: new ol.style.Fill({
                  color: c.highlightObstruction
                })
              })
            })];
      };

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

angular.module('flannel').factory('StyleService', StyleService_);
