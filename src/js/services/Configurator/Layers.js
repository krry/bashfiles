// Configurator Layers
/*
 *
 *
 *
 *
 */

angular.module('flannel').factory('Layers', ['Design', 'StyleService', Layers_]);

function Layers_(Design, Styles) {

  var layers, l_draw, source;

  draw_source = Design.draw_source;
  modify_source = Design.modify_source;

  l_draw = new ol.layer.Vector({
    source: draw_source,
    style:  Styles.defaultStyleFunction,
  });
  l_modify = new ol.layer.Vector({
    source: modify_source,
    style:  Styles.highlightStyleFunction,
  });
  layers = [ l_draw, l_modify ];
  /* draw_source listeners */
  draw_source.on('addfeature',function(e){
    // console.debug('draw_source: addfeature',e);
    // console.debug('featuresremaining = ', draw_source.getFeatures().length);
  });
  draw_source.on('removefeature',function(e){
    // console.debug('draw_source: removefeature',e);
    // console.debug('featuresremaining = ', draw_source.getFeatures().length);
  });

  /* modify_source listeners */
  modify_source.on('addfeature',function(e){
    // console.debug('modify_source: addfeature',e);
    // console.debug('featuresremaining = ', modify_source.getFeatures().length);
  });
  modify_source.on('removefeature',function(e){
    // console.debug('modify_source: removefeature',e);
    // console.debug('featuresremaining = ', modify_source.getFeatures().length);
  });

  return layers;
}
