// Configurator Layers
/*
 *
 *
 *
 *
 */

angular.module('flannel').factory('Layers', ['Design', 'StyleService', Layers_]);

function Layers_(Design, Styles) {

  var layers, l_draw, area_collection, source;

  area_collection = new ol.Collection();
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
  
  area_collection.on('add', function (e) {
    // add to sources
    var feature = e.target;
    draw_source.addFeature(feature);
    modify_source.addFeature(feature);
  });
  area_collection.on('remove', function (e) {
    // remove from sources
    var feature = e.target;
    draw_source.removeFeature(feature);
    modify_source.removeFeature(feature);
  });

  Design.rx_areas.subscribe(function (areas_object) {
    var feature;
    if (areas_object === "remove by remote") {
      area_collection.pop();
    }
    else if (areas_object === "remove by client") {
      area_collection.pop();
    }
    else {
      feature = AreaService.wireUp(areas_object.id, areas_object.wkt );
      area_collection.push(feature);
    }
  })

  layers = {
    draw : l_draw,
    modify: l_modify,
    array: [ l_draw, l_modify ],
    area_collection:  area_collection,
  };

  return layers;
}
