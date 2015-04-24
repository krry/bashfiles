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

controllers.controller("OlMapCtrl", ["$scope", "$timeout", "Clientstream", "Session", "InteractionService", "StyleService", "Design", "Configurator", "addWkt", OlMapCtrl_]);

function OlMapCtrl_($scope, $timeout, Client, Session, InteractionService, StyleService, Design, Configurator, addWkt) {

  vm = this;
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
    remote_stream.distinctUntilChanged().delay(500).subscribe( fb_sub );
    // connect to the draw event
    interactions.draw.once('drawstart', draw_start );
    interactions.draw.once('drawend',   draw_end );
  }

  /* helper functions TODO: service these
     wkt allows us to turn feature.getGeometry() into text, text into geometry for
     use with feature.setGeometry()
  */
  wkt = new ol.format.WKT();
  function featFromTxt (wkt_txt, style_param) {
    // console.log('feat from text', wkt_txt)
    var feature = wkt.readFeature(wkt_txt);
    var geometry = wkt.readGeometry(wkt_txt);
    feature.set(style_param, geometry);
    feature.setGeometryName(style_param);
    return feature;
  }
  /* end helpers */


  // state of the interface, used to filter messages from remote_stream
  // true when the client is updating itself, or firebase, until the confirmation
  // of last last edit is recieved from firebase.
  $scope.draw_busy = false;
  // client_stream
  Client.listen('update_client', update_client); // messages from remote
  Client.listen('update_remote', update_remote); // messages from the feature

  function getWkt(f) {
    return wkt.writeGeometry(f.getGeometry());
  }

  function getGeom(txt) {
    return wkt.readGeometry(txt);
  }

  function update_remote (geom) {
    // $scope.draw_busy = true;
    Design.areas_ref().child('area').set(wkt.writeGeometry(geom));
    if (!$scope.$$phase) $scope.$apply();
  }

  function update_client (txt) {
    var remote_feature;
    if (Design.feature() !== 'undefined' && !$scope.draw_busy) { // you're sync'd but you should do something with new data
      // console.log('=============== what should i do now, boss? ================', txt)
      // make a new feature
      /* jshint -W030 */
      typeof txt !== "string" && (txt = txt.area);
      /* jshint +W030 */
      remote_feature = featFromTxt(txt, 'area');
      // make it referencable
      Design.feature(remote_feature);
      // make it useable
      Design.feature().setGeometry(getGeom(txt));
      // add it to the map
      Configurator.overlay().addFeature(remote_feature);
      // make sure it works right.
      draw_start(remote_feature); // HACK: consolidate this function for both client & firebase processes?
      draw_end();
      Client.emit('OlMapCtrl: remote feature added')
    } else if (diff_client(txt) && !$scope.draw_busy) { // remote different from local, and local sync'd
      Design.feature().setGeometry(getGeom(txt));
    } else if (!diff_client(txt)) { // remote and local are the same
      // console.log("!diff_client(txt)", txt, !diff_client(txt));
      $scope.draw_busy = false;
      if (!$scope.$$phase) $scope.$apply();
    }
  }

  function diff_client(txt) { // test helper
    var remote_feature,
        result;

    if (!Design.feature()) {
      // create a feature that was on firebase only
      result = true;
    } else {
      result = txt !== Design.feature().get('wkt');
    }
    // use the existing design feature
    return result;
  }

  function remote_map (x){
    return x.exportVal().area;
  }

  function fb_sub (txt) {
    if (txt === null) return;
    Client.emit('update_client', txt);
  }

  function draw_start (evt, ftr) {
    ftr = ftr || evt.feature; // accept a feature from firebase design, or the event
    // console.log('draw_start');
    $scope.draw_busy = true;
    if (!$scope.$$phase) $scope.$apply();
    Design.feature(ftr);
  }

  function update_wkt_while_modify (f) {
    $scope.draw_busy = true;
    if (!$scope.$$phase) $scope.$apply();
    Design.feature().set('wkt', getWkt(Design.feature()));
  }

  function draw_end () {
    $scope.draw_busy = false;
    if (!$scope.$$phase) $scope.$apply();
    // console.log('draw_end');
    Design.feature().set('wkt', getWkt(Design.feature()));
    Design.feature().on('change:wkt', wkt_update_notification);
    Design.feature().getGeometry().on('change', update_wkt_while_modify);
    Client.emit('update_remote', Design.feature().getGeometry());
    Client.emit('drawing closed', true);
  }

  function wkt_update_notification (ft) {
    Client.emit('update_remote', Design.feature().getGeometry());
  }
}
