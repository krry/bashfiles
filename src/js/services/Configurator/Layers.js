// Configurator Layers
/*
 *
 *
 *
 *
 */

angular.module('flannel').factory('Layers', ['Design', 'StyleService', 'AreaService', 'Clientstream', Layers_]);

function Layers_(Design, Styles, AreaService, Client) {

  var layers, l_draw, area_collection, source;

  rx_drawcount = new Rx.Subject();


  Design.all_the_areas.subscribe(function (area) {
    console.log(area," was just added");
  })

  area_collection = new ol.Collection();
  draw_source   = Design.draw_source;
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
    var feature = e.element;
    draw_source.addFeature(feature);
    modify_source.addFeature(feature);
  });
  area_collection.on('remove', function (e) {
    // remove from sources
    var feature = e.element;
    draw_source.removeFeature(feature);
    modify_source.removeFeature(feature);
  });

  area_collection.on('change:length',function(e){
    rx_drawcount.onNext(this.getLength());
  })

  Design.rx_areas
    .map(function (ds) {
      return ds.exportVal();
    })
    .subscribe(function (areas_object) {
    var feature;
    if (areas_object === "remove by remote") {
      area_collection.pop();
    }
    else if (areas_object === "remove by client") {
      area_collection.pop();
    }
    else {
      console.log(areas_object)
      if (areas_object === null) {
        console.debug('areas_object is null because the fb_ref has no area yet')
        // handle this case if it continues to be an issue
        return
      }
      // make sure your area string looks right
      feature = AreaService.wireUp(0, areas_object[0].wkt );
      area_collection.push(feature);
    }
  })

  layers = {
    draw : l_draw,
    modify: l_modify,
    array: [ l_draw, l_modify ],
    area_collection:  area_collection,
    rx_drawcount: rx_drawcount,
  };

  return layers;
}
