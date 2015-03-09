// Configurator Interactions
/*
 *
 *
 *
 *
 */

angular.module('flannel').factory('Interactions', ['Design', 'StyleService', Interactions_]);

function Interactions_(Design, Style) {
    // interactions
    var interactions,
        draw,
        modify,
        zoom,
        dragpan;

    interactions = new ol.Collection();

    var draw = new ol.interaction.Draw({
      source: Design.area_source,
      type: 'Polygon',
      geometryName: 'area',
    });

    interactions.push(draw);
    // draw
      // add
        // return map.addInteraction()
      // remove
    // modify
      // add
        // draw.onNext('add');
      // remove
        // modify.onNext('remove');
    // zoom
      // add
        // zoom.onNext('add', map);
      // remove
        // zoom.onNext('remove', map);
    // controls
      // add
        // controlls.onNext('add', map);
      // remove
        // controlls.onNext('remove', map);



  interactions.draw = new Rx.Observable.fromEventPattern(
    function addHandler(h) {
      console.debug('add handler center', h);
      // return view.on('change:center', h);
    },
    function delHandler (h) {
      // return view.off('change:center', h);
    }
  );

  interactions.modify   = new Rx.Observable.fromEventPattern(
    function addHandler(h) {
      // return view.on('change:resolution', h);
    },
    function delHandler (h) {
      // return view.off('change:resolution', h);
    }
  );

  return interactions;
}
