// Configurator View
/*
 * this is the Configurator for the map.
  *
 * inject it as you deem necessary... necessarily.
 *
 */

angular.module('flannel').factory("View", ['Design', 'Session', 'Clientstream', View_]);

function View_(Design, Session, Client) {
  var view, center_listner_key, zoom_listener_key;


  Client.listen('Configurator: target set', function () {
    Design.rx_zoom.onNext(view.getZoom());
    Design.rx_center.onNext({lng: view.getCenter()[0], lat: view.getCenter()[1] } );
  })


  center = [0, 0]; // default center allows configurator to startup without Firebase connection

  view = new ol.View({
    center: center,
    projection: 'EPSG:4326',
    minZoom: 18, // don't zoom out past the 'EPSG:4326' projection hahahaha
    maxZoom: 20, // don't zoom further than google can zoom // TODO: set this to the maxzoom at the current location
  });
  // this bootstraps the view in the case of direct state navigation
   Client.listen('Design: Loaded', function bootstrapViewCenter(data) {
    //view.setCenter([data.map_center.lng, data.map_center.lat]);
    view.on('change:center', function(){
      Design.ref().child('map_details/center').update({
        lat: view.getCenter()[1],
        lng: view.getCenter()[0],
      });
    });

    view.on('change:resolution', function(){
      Design.ref().child('map_details/zoom_level').set(view.getZoom());
    });
  });


  // update center from remote
  Design.rx_center.subscribe(function subViewCenterToRemote (center_val){
    if (center_val === null) {
        console.log('no d.exists() wait for session & set mapcenter **********************')

      Session.ref().child('map_center').once('value', function (ds) {
        data = ds.exportVal()
        var center = [data.lng, data.lat]
        console.log('setting mapcenter now brah ************************************')
        view.setCenter(center)
      })
      return;
    } else {
      var center = [center_val.lng, center_val.lat];
      view.setCenter(center);
    }
    // debugger;
    // var center = [d.exportVal().lng, d.exportVal().lat];
    // view.setCenter(center);
  });

  // update zoom level from remote
  Design.rx_zoom.subscribe(function handleZoom (zoom_val){
    if (zoom_val === null) {
      return view.setZoom(18);
    } else {
      return view.setZoom(zoom_val);
    }
  });

  /*Client.listen('Design: Loaded', function bootstrapView(design_data) {
      view.setCenter([design_data.map_details.center.lng,
        design_data.map_details.center.lat]);
      view.setZoom(design_data.map_details.zoom_level);
  });*/

  // wait for configurator to set the center before setting the listeners
  /*view.once('change:center', function() {
    // update the map_center from remote
    Design.ref().child('map_details/center').observe('value')
    .throttle(100)
    .subscribe(subViewCenterToRemote);
    // notify remote of map_center change
    view.on('change:center', function(){
      Design.ref().child('map_details/center').update({
        lat: view.getCenter()[1],
        lng: view.getCenter()[0],
      })
    })
  });*/

  // wait for configurator to set the zoom before setting the listeners
  /*view.once('change:resolution', function() {
    // update zoom from remote
    Design.ref().child('map_details/zoom_level').observe('value')
    .throttle(100)
    .subscribe(handleZoom);
    // notify remote of zoom change
    view.on('change:resolution', function(){
      Design.ref().child('map_details/zoom_level').set(view.getZoom());
    })
  });*/


  view.rx_center = new Rx.Observable.fromEventPattern(
    function addHandler(h) {
      center_listner_key = view.on('change:center', h);
      return center_listner_key;
    },
    function delHandler (h) {
      return view.unByKey(center_listner_key);
    }
  );

  view.rx_zoom   = new Rx.Observable.fromEventPattern(
    function addHandler(h) {
      zoom_listener_key = view.on('change:resolution', h);
      return zoom_listener_key;
    },
    function delHandler (h) {
      return view.unByKey(zoom_listener_key);
    }
  );

  return view
}
