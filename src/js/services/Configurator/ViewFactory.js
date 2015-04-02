/* ==================================================

  This is the Configurator's View.

  center: [lat,lng] center of the map
  zoom:   zoom level of the map
  extent: [nw, ne, sw, se] corners of the visible map
  view:   needed to start the map

================================================== */
angular.module('flannel').factory('ConfiguratorView', ['Clientstream', 'Design', ConfiguratorViewFactory_]);

function ConfiguratorViewFactory_ (Client, Design) {
  var service,
      center,
      zoom,
      extent,
      view;

  var service = {
    subscribeView: subscribeView,
    view: _view,
  };


  Client.listen('Design: Loaded', function (argument) {
    // body...
  })
  Client.listen('Design: stream map_details', subscribeView)

  function subscribeView (streams) {
    console.log('subscribeView');

    Design.streams().map.center
      .subscribe(function subscribeToCenter (c) {
        console.log('subscribe to firebase stream for view\'s center');
        view.setCenter(c.data);
      });

    Design.streams().map.zoom_level
      .subscribe(function subscribeToZoom (z) {
        console.log('subscribe to firebase stream for view\'s zoom level');
        view.setCenter(z.data);
      });
  }

  function makeView (map_details) {
    console.log('map_details', map_details);
    view = new ol.View({
      center: [Design.map_center()[0], Design.map_center()[1]],
      center: [map_details.map_center[0], map_details.map_center[1]],
      // zoom: map_details.zoom_level,
      zoom: 1,
      maxResolution: 1, // hack: hardcoding max zoom out
      minResolution: 0.08, // hack: hardcoding max zoom in
    });
    console.log('view.getCenter()', view.getCenter());
    view.on('change:center', function (e) {
      console.log('view center is changing');
    });
    return view;
  }

  function _view (details) {
    if (!view) {
      console.log('making new view()');
      view = makeView(details);
    }
    console.log('returning view', view);
    return view;
  }

  return service;
}
