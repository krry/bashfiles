// Configurator Layers
/*
 *
 *
 *
 *
 */

angular.module('flannel').factory('Layers', ['Design', 'StyleService', 'AreaService', 'Clientstream', Layers_]);

function Layers_(Design, Styles, AreaService, Client) {

  var layers, l_draw, areas_collection, source;

  var rx_drawcount = new Rx.Subject(); // the next button subscribes to this

  var feature; // we modify this shape

  areas_collection = Design.areas_collection
  draw_source      = Design.draw_source;
  modify_source    = Design.modify_source;

  l_draw = new ol.layer.Vector({
    source: draw_source,
    style:  Styles.defaultStyleFunction,
  });

  l_modify = new ol.layer.Vector({
    source: modify_source,
    style:  Styles.highlightStyleFunction,
  });

  areas_collection.on('add', function (e) {
    // add to sources
    feature = e.element;
    feature = AreaService.wireUp(0, feature);
    draw_source.addFeature(feature);
    modify_source.addFeature(feature);
  });

  areas_collection.on('remove', function (e) {
    // remove from sources
    var feature = e.element;
    Design.ref().child('areas/0/wkt').remove()
    draw_source.removeFeature(feature);
    modify_source.removeFeature(feature);
  });

  // broadcast to the templates to enable/disable clicking of "next" button
  areas_collection.on('change:length',function(e){
    rx_drawcount.onNext(this.getLength());
  })

  // update based on changes at firebase
  Design.rx_areas.subscribe(function (area) {
    // we have a feature
    debugger


    if (area && areas_collection.getLength()) {
      console.log('areaslength')
      if (area === 'removed by client') {
        areas_collection.pop();
        Client.emit('Stages: stage', 'back'); // TODO: move this to a subscription in StagesCtrl
      } else {

        if (area.wkt === feature.get('wkt')) {
          console.log('area the same as feature')
          return Design.busy = false;
        }
        // or change the shape of the shape if you're not busy
        // console.log(AreaService.getGeom(area.wkt))
        return area && feature.setGeometry(AreaService.getGeom(area.wkt));
      }
    } else if (area !== null){
      // we don't have a feature
      feature = AreaService.featFromTxt(area.wkt, 'area');
      return areas_collection.push(feature);
    }
  });

  layers = {
    draw : l_draw,
    modify: l_modify,
    array: [ l_draw, l_modify ],
    areas_collection:  areas_collection,
    rx_drawcount: rx_drawcount,
  };

  return layers;
}
