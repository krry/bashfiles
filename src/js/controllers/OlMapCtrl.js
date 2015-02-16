/* ========================================================

  OlMapCtrl

  responsible for establishing connections with, and
  monitoring streams between Firebase and the client

  important events:
    * Map Center
    * Zoom Level
    * Area Add
    * Modify Area
    * Slope
    * Peak

======================================================== */

controllers.controller("OlMapCtrl", ["$scope", "$timeout", "Clientstream", "Session", "InteractionService", "StyleService", "Design", "updateArea", "addWkt", OlMapCtrl_]);

function OlMapCtrl_($scope, $timeout, Client, Session, InteractionService, StyleService, Design, updateArea, addWkt) {

  var remote_stream,
      wkt,
      vm,
      live_feature,
      gmapCenter;

  // app wiring
  Client.listen('Configurator: Loaded', bootstrapOlMapCtrl );

  function bootstrapOlMapCtrl (interactions) {
    // remote evt stream
    remote_stream = Design.areas_stream().map( remote_map );
    remote_stream.delay(500).subscribe( fb_sub );
    // connect to the draw event
    interactions.draw.once('drawstart', draw_start );
    interactions.draw.once('drawend',   draw_end );
    Client.emit('OlMapCtrl: Loaded');
  }

  /* helper functions TODO: service these
     wkt allows us to turn feature.getGeometry() into text, text into geometry for
     use with feature.setGeometry()
  */
  vm = this;
  wkt = new ol.format.WKT();
  /* end helpers */


  // state of the interface, used to filter messages from remote_stream
  // true when the client is updating itself, or firebase, until the confirmation
  // of last last edit is recieved from firebase.
  $scope.draw_busy = false;
  // client_stream
  Client.listen('update_client', update_client); // messages from remote
  Client.listen('update_remote', update_remote); // messages from the feature
  /*
    TODO: when tiles come back, listen for that, and hide the spinner
    Client.listen('static tiles loaded', hideSpinner);
  */

  function getWkt(f) {
    return wkt.writeGeometry(f.getGeometry());
  }

  function getGeom(txt) {
    return wkt.readGeometry(txt);
  }

  function hideSpinner () {
    Client.emit('spin it', false);
  }

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

  function remote_map (x){
    return x.exportVal().area;
  }

  function fb_sub (txt) {
    Client.emit('update_client', txt);
  }

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
    // TODO: decide whether to auto-advance user or to let them approve
    Client.emit('drawing closed', true);
    // Client.emit('stage', "next");
    // Session.next();
  }

  function wkt_update_notification (ft) {
    Client.emit('update_remote', Design.feature().getGeometry());
  }
}
