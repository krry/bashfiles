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

  // layer for roofpeak
  r_layer = new ol.layer.Vector({
    source: Design.roofpeak_source,
    style:  Styles.remap,
    name: 'roof_area_layer',
  });


  modify_overlay = Design.modify_overlay;
  roofpeak_overlay =  Design.roofpeak_overlay;

  // var modify_overlay = new ol.FeatureOverlay({
  //   features: Design.areas_collection,
  //   style:    Styles.highlightStyleFunction,
  // })

  areas_collection.on('add', function (e) {
    // add to sources
    feature = e.element;
    feature = AreaService.wireUp(0, feature);
    draw_source.addFeature(feature);
    // modify_source.addFeature(feature);
    modify_overlay.addFeature(feature);
    Client.emit('areas in collection', feature)
  });

  areas_collection.on('remove', function (e) {
    // remove from sources
    var feature = e.element;
    Design.ref().child('areas/0/wkt').remove()
    draw_source.removeFeature(feature);
    // modify_source.removeFeature(feature);
    modify_overlay.removeFeature(feature);
  });

  // broadcast to the templates to enable/disable clicking of "next" button
  areas_collection.on('change:length',function(e){
    rx_drawcount.onNext(this.getLength());
  })

  // update based on changes at firebase
  Design.rx_areas.subscribe(function (area) {
    if (area && areas_collection.getLength()) {
      // we have a message, and a feature on the client
      if (area === 'removed by client') { // TODO: this should be a global Var for Remove Feature From Client
        // sent by 'clear polygon' button
        areas_collection.pop();
        Client.emit('Stages: stage', 'back'); // TODO: move this to a subscription in StagesCtrl
      } else {
        // sent by remote
        if (area.wkt === feature.get('wkt')) {
          console.log('area the same as feature')
          return Design.busy = false;
        }
        return area && feature.setGeometry(AreaService.getGeom(area.wkt));
      }
    } else if (area !== null){
      // we don't have a feature
      feature = AreaService.featFromTxt(area.wkt, 'area');
      return areas_collection.push(feature);
    }
    else if (area === null && areas_collection.getLength()) {
      Design.rx_areas.onNext('removed by client');
    }
  });

  layers = {
    draw : l_draw,
    modify: l_modify,
    roofpeak: r_layer,
    roofpeak_overlay: Design.roofpeak_overlay,
    collection: new ol.Collection(),
    areas_collection:  areas_collection,
    rx_drawcount: rx_drawcount,
    modify_overlay: Design.modify_overlay,
  };

  return layers;
}
