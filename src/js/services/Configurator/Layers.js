// Configurator Layers
/*
 *
 *
 *
 *
 */

angular.module('flannel').factory('Layers', ['Design', 'StyleService', Layers_]);

function Layers_(Design, Style) {

    var layers, vector, source;

    source = Design.area_source;

    l_vector = new ol.layer.Vector({source: source});
    layers = [ l_vector ];

    source.on('addfeature',function(e){
      
      console.debug('source: addfeature',e);
    })

  return layers;
}
