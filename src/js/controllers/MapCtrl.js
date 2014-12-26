controllers.controller("MapCtrl", ["$scope", "$timeout", "StreamService", "SyncService", "MapService", "LayerService", "InteractionService", "Session", "Design", "updateArea", "addWkt", MapCtrl_]);
function MapCtrl_($scope, $timeout, Stream, Sync, MapService, LayerService, InteractionService, Session, Design, updateArea, addWkt) {
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
  // end helpers
  var vm = this;
  var live_feature;

  // for dev: //////////////////////////////
  Design.ref().set({
      area: "POLYGON((783.9111328125 480.6137878857553,729.95361328125 379.82623117417097,632.21923828125 476.5415222607553,650.54443359375 397.1323425732553,792.0556640625 403.2407410107553,783.9111328125 480.6137878857553))",
      owner: "owner_id",
      session: Session.ref().parent().key(),
      data: "data_id",
      sync: "true",
    })

  // todo: these should be turned into providers
  LayerService.init();
  InteractionService.init();
  // end dev: //////////////////////////////

  // state of the interface
  $scope.draw_busy = false;
  // client_stream
  var client_stream = new Stream();
  client_stream.listen('update_client', update_client); // messages from remote
  client_stream.listen('update_remote', update_remote); // messages from the feature

  function update_remote (geom) {
    try {
      geom.extent && Design.ref().update({area: wkt.writeGeometry(geom)});
    } catch (er){
      return console.log('err in update_remote', er);
    }
  }

  function update_client (txt) {
    !$scope.draw_busy && live_feature.setGeometry(wkt.readGeometry(txt));
  }

  // remote evt stream
  Design.area_stream().skip(1).map( remote_map ).subscribe( fb_sub );
  function remote_map (x, idx, observable){
    return !$scope.draw_busy && (x.exportVal() || x);
  }
  function fb_sub (txt) {
    client_stream.emit('update_client', txt);
  }

  // openlayers connection
  // ( hack: bwah... why's it gotta be this way?)
  var draw_interaction = InteractionService.get('draw');
  draw_interaction.once('drawstart', feature_added );
  draw_interaction.on('drawstart', draw_busy );
  draw_interaction.on('drawend',   draw_end );

  function draw_busy (evt) {
    $scope.draw_busy = true;
  }
  function draw_end (evt) {
    $scope.draw_busy = false;
  }
  function feature_added (f) {
    f = f.feature;
    console.log('feature_added', f)
    live_feature = f;
    // bind feature's geometry to a key "wkt"
    f.set('wkt', getWkt(f) )
    f.getGeometry().on('change',  function (geom) {
      $scope.draw_busy = true;
      geom = geom.target;
      client_stream.emit('update_remote', geom);
    })
  }
}
