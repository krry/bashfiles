controllers.controller("MapCtrl", ["$scope", "$timeout", "Clientstream", "MapService", "LayerService", "InteractionService", "StyleService", "Session", "Design", "updateArea", "addWkt", "Configurator", MapCtrl_]);
function MapCtrl_($scope, $timeout, Client, MapService, LayerService, InteractionService, StyleService, Session, Design, updateArea, addWkt, Configurator) {

  /* ===============================
  TODO:
    * this name is unhelpful
    * too many services loaded in here

  MapCtrl is responsible for establishing connections with, and monitoring streams between Firebase and the client
    important events:
    Map Center

    Zoom Level
    Area Add
    Modify Area
    Slope
    Peak

  =============================== */
  // helper functions TODO: service these --
      // wkt allows us to turn feature.getGeometry() into text, text into geometry for
      // use with feature.setGeometry()

      var wkt = new ol.format.WKT();
      function getWkt(f) {
        return wkt.writeGeometry(f.getGeometry());
      }
      function getGeom(txt) {
        return wkt.readGeometry(txt);
      }

  // end helpers
  var vm = this;
  var live_feature;

  // state of the interface
  $scope.draw_busy = false;
  // client_stream
  Client.listen('update_client', update_client); // messages from remote
  Client.listen('update_remote', update_remote); // messages from the feature

  function update_remote (geom) {
    // $scope.draw_busy = true;
    Design.areas_ref().child('area').set(wkt.writeGeometry(geom));
    $scope.$apply();
  }

  function update_client (txt) {
    if (!diff_client(txt)) { // remote and local are the same
      $scope.draw_busy = false;
      $scope.$apply();
    } else if (diff_client(txt) && !$scope.draw_busy) { // remote different from local, and local sync'd
      Design.feature().setGeometry(getGeom(txt));
    } else if (!$scope.draw_busy) { // you're sync'd but you should do something with new data
      console.log('==================== what should i do now, boss? ================')
      // make a new feature
      // add it to the map
      // make sure it works right.
    }
  }

  function diff_client(txt) { // test helper
    var result;
    try {
      result = txt !== Design.feature().get('wkt');
    } catch (err) {
      console.error('dummy', err)
    }
    return result;
  }

  // remote evt stream
  var remote_stream = Design.areas_stream().map( remote_map );
  remote_stream.delay(500).subscribe( fb_sub )
  function remote_map (x){
    return x.exportVal().area;
  }
  function fb_sub (txt) {
    Client.emit('update_client', txt);
  }

  // openlayers connection
  Configurator.draw().once('drawstart', draw_start );
  Configurator.draw().once('drawend',   draw_end );

  function draw_start (evt) {
    console.log('draw_start');
    $scope.draw_busy = true;
    $scope.$apply();
    Design.feature(evt.feature);
  }
  function update_wkt_while_modify (f) {
    $scope.draw_busy = true;
    $scope.$apply();
    Design.feature().set('wkt', getWkt(Design.feature()));
  }
  function draw_end (evt) {
    $scope.draw_busy = false;
    $scope.$apply();
    console.log('draw_end');
    Design.feature().set('wkt', getWkt(Design.feature()));
    Design.feature().on('change:wkt', wkt_update_notification);
    Design.feature().getGeometry().on('change', update_wkt_while_modify);
    Client.emit('update_remote', Design.feature().getGeometry());
    Session.next();
  }

  function wkt_update_notification (ft) {
    Client.emit('update_remote', Design.feature().getGeometry());
  }
}
