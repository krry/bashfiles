// Configurator Layers
/*
 *
 *
 *
 *
 */

angular.module('flannel').factory('Layers', ['Design', 'StyleService', 'AreaService', 'Clientstream', Layers_]);

function Layers_(Design, Styles, AreaService, Client) {

  var layers, l_draw, l_modify, l_roofpeak, areas_collection, source, modify_collection;

  var rx_drawcount = new Rx.BehaviorSubject(); // the next button subscribes to this

  var feature; // we modify this shape

  areas_collection = Design.areas_collection
  draw_source      = Design.draw_source;
  modify_source    = Design.modify_source;
  modify_collection = Design.modify_collection;

  // layers
  l_draw = new ol.layer.Vector({
    source: draw_source,
    style:  Styles.defaultStyleFunction,
  });

  l_modify = new ol.layer.Vector({
    source: modify_source,
    style:  Styles.highlightStyleFunction,
  });

  l_roofpeak = new ol.layer.Vector({
    source: Design.roofpeak_source,
    style:  Styles.remap,
    name: 'roof_area_layer',
  });

  // overlays
  modify_overlay = Design.modify_overlay;

  // roofpeak stuff
  // a collection to hold the highlighted feature
  var h_coll = new ol.Collection([]);

  // highlighted segments get rendered by this FeatureOverlay
  highlight_overlay = new ol.FeatureOverlay({
    style: Styles.remapHighlight,
    features: h_coll,
  });

  areas_collection.on('add', function (e) {
    // add to sources
    feature = e.element;
    // add to the visible vectors for Draw
    draw_source.addFeature(feature);
    // clear & set the visible vectors
    modify_overlay.getFeatures().clear();
    modify_overlay.addFeature(feature);
    // clear & set the modifiable feature group
    Design.modify_collection.clear()
    Design.modify_collection.push(feature);
    // TODO: whatever is dependent on this should be watching Design.rx_areas instead
    Client.emit('areas in collection', feature)
  });

  areas_collection.on('remove', function (e) {
    var ftr = e.element;
    // remove from remote
    Design.ref().child('areas/0').remove()
    // remove from local sources
    draw_source.removeFeature(ftr);
    // remove from local modify visible
    modify_overlay.removeFeature(ftr);
    modify_collection.clear();
  });

  // broadcast to the templates to enable/disable clicking of "next" button
  areas_collection.on('change:length',function(e){
    rx_drawcount.onNext(this.getLength());
  })

  Design.modify_collection.on('add', function (e) {
    var f = e.element;
    // when we modify a surface watch & alert firebase for changes
    AreaService.wireUp(0, f);
  });

  // update based on changes at firebase
  Design.rx_areas.subscribe(function (area) {
    if (area === 'removed by client' && areas_collection.getLength() === 0 ) {
      // case where user presses "redo", deletes the feature, then browser back
      Client.emit('Stages: stage', 'back'); // TODO: move this to a subscription in StagesCtrl
    } else if (area && areas_collection.getLength()) {
      // we have a message, and a feature on the client
      if (area === 'removed by client') { // TODO: this  message string should be a global Var for Remove Feature From Client
        // sent by 'clear polygon' button
        areas_collection.pop();
        Client.emit('Stages: stage', 'back'); // TODO: move this to a subscription in StagesCtrl
      } else {
        // sent by remote
        if (area.wkt === feature.get('wkt')) {
          // console.log('area the same as feature')
          return Design.busy = false;
        }
        if (area) {
         feature.setGeometry(AreaService.getGeom(area.wkt));
         if (modify_collection.getLength()) {
          // TODO: this could be prettier, i think.
          // currently results in situations where you lose the feature beneath the mouse
          // if you're moving the mouse too quickly.
          modify_collection.clear()
          modify_collection.push(feature);
         }
       }
      }
    } else if (area !== null){
      // we don't have a feature, but we should make one.
      feature = AreaService.featFromTxt(area.wkt, 'area');
      return areas_collection.push(feature);
    }
    else if (area === null && areas_collection.getLength()) {
      areas_collection.pop();
    }
  });

  layers = {
    draw : l_draw,
    modify: l_modify,
    roofpeak: l_roofpeak,
    roofpeak_overlay: highlight_overlay,
    h_coll: h_coll,
    collection: new ol.Collection(),
    overlays_collection: new ol.Collection(),
    areas_collection:  areas_collection,
    rx_drawcount: rx_drawcount,
    modify_overlay: Design.modify_overlay,
  };

  return layers;
}
