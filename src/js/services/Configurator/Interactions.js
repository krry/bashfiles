/**  Configurator Interactions
 *
 *
 *
 *
 */

angular.module('flannel').factory('Interactions', ['Design', 'Clientstream', 'StyleService', 'AreaService', Interactions_]);

function Interactions_(Design, Client, Styles, AreaService) {

  var interactions = {},
    // interactions
      draw,
      modify,
      zoom,
      dragpan,
    // options
      draw_opt,
      pointer_opt,
      dragpan_opt = { enableKinetic: true };

  // an interactions stream... obviously
  interactions.rx = new Rx.BehaviorSubject(null);
  interactions.rx.subscribe(subInteractions);

  // configure the draw
  draw_opt = {
    type: 'Polygon',
    snapTolerance: 15, // defaults to 12
    style: Styles.drawStyle,
  }

  function subInteractions (x) {
    if (x === 'reset draw') {
      interactions.draw.setActive(false);
      interactions.draw.setActive(true);
      Design.ref().child('areas').child('0').set(null);
    } if (x === 'drawing') {
      Design.ref().child('areas').child('0').set(null);
    }
  }
  // map subscribes to these collections to know what's
  interactions.collection = new ol.Collection();
  interactions.controls   = new ol.Collection();

  // HACK: configure Pointer interaction to ignore `pointerdrag` events
  // this is a problem with OL 3.5... i think (jfl) 27 march
  pointer_opt = {
    handleDragEvent: function (evt) {
      // return true to start a drag sequence
      if (interactions.draw.getActive() && evt.dragging) {
        return false;
      }
    }
  }
  interactions.pointer = new ol.interaction.Pointer(pointer_opt);
  // dragpan
  interactions.dragpan = new ol.interaction.DragPan(dragpan_opt);
  // mousewheel zoom
  interactions.zoom    = new ol.interaction.MouseWheelZoom();
  // drawing areas on the map
  interactions.draw = new ol.interaction.Draw(draw_opt);
  // HACK: override default handleEvent to make dragging impossible on draw event.
  interactions.draw.handleEvent = function (mapBrowserEvent) {
    if (interactions.draw.getActive() && mapBrowserEvent.dragging) {
      return false;
    }
    // note that we've also overridden the Pointer handle code with pointer_opt above
    return ol.interaction.Pointer.handleEvent.call(this, mapBrowserEvent);
  }

  interactions.draw.on('drawend', function(e){
    // after user draws a shape, notify remote the feature is set.
    var feature = e.feature;
    Design.ref().child('areas').child('0').set({ // HACK: one area only
      wkt: AreaService.getWkt(feature),
    });
    Client.emit('Stages: stage', 'next');
  });

  interactions.draw.on('drawstart', function(e){
    // make sure that all modify shapes are eliminated
    interactions.rx.onNext('drawing');
  });

  // modify
  Design.modify_overlay.setFeatures(Design.modify_collection);
  interactions.modify_overlay = Design.modify_overlay;
  interactions.modify = new ol.interaction.Modify({
    features: Design.modify_collection,
    // current
    style: Styles.mouseModifyStyle,
    // lower pixelTolerance makes it easier to add a vertex during modify
    // higher pixelTolerance is advised to prevent users from adding too many pixels
    pixelTolerance: 25, // defaults to 10
    // the SHIFT key must be pressed to delete vertices, so
    // that new vertices can be drawn at the same position
    // of existing vertices
    deleteCondition: function(event) {
      return ol.events.condition.shiftKeyOnly(event) &&
          ol.events.condition.singleClick(event);
    }
  });

  interactions.modify.clearArea = function () {
    Design.rx_areas.onNext("remove by client");
  }

  return interactions;
}
