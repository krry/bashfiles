controllers.controller("MapCtrl", ["$scope", "$timeout", "StreamService", "SyncService", "MapService", "LayerService", "InteractionService", "Session", "Design", "updateArea", "addWkt", MapCtrl_]);

function MapCtrl_($scope, $timeout, Stream, Sync, MapService, LayerService, InteractionService, Session, Design, updateArea, addWkt) {
  var vm = this;

  // TODO: service this

  // helper functions TODO: service these --
        // wkt allows us to turn feature.getGeometry() into text, text into geometry for
        // use with feature.setGeometry()

        var wkt = new ol.format.WKT();
        function getWkt(f) {
          return wkt.writeGeometry(f.getGeometry());
        }
  // end helpers


  // save the area for later reference.... but?
  // Sync.set('area', Design.ref().child('area')); // is this necessary?



  // state of the interface
  $scope.draw_busy = false;
  $scope.curr_wkt = 'futts';



  var configurator_stream = new Stream();

  configurator_stream.listen('update', function feat_change (f) {
    if (!$scope.draw_busy && ($scope.area = f)) {
      $scope.area.on('change:start', draw_modify_emitter);
      $scope.area.on('change:start', draw_modify_emitter);
      Design.area_ref().set(getWkt($scope.area))
    }
  })

  // for dev: //////////////////////////////
  var area_ref, remote_area_stream, remote_area_source, client_area_stream;
  var hack_wkt = "POLYGON((741.15234375 658.6914028376342,611.85791015625 655.6372036188842,642.39990234375 569.1015590876342,779.49951171875 568.4228481501342,741.15234375 658.6914028376342))"
  // $timeout(function(){
  //   debugger
  //   Design.ref().set({
  //     owner:          "prospect_id",  // TODO: link this up
  //     session:        "session_id",   // TODO: link this up
  //   })
    remote_area_stream = Design.ref().child('area').observe('value').map(function(x){
      x = x.val() || x;
      return x
    }).subscribe(function(wkt_txt) {
      !$scope.draw_busy && configurator_stream.emit('new_val', wkt_txt)
    })
  // },1)

  LayerService.init();
  InteractionService.init();

  // listen to map for added area
  var area_source = LayerService.getLayer('area').getSource();
  // area_source.on('addfeature', sourceListener)

  // listen to draw event
  InteractionService.get('draw').on('drawend',   draw_modify_emitter );

  // end dev: //////////////////////////////


  // listen to features
  function draw_modify_emitter (evt) {
    console.log('draw_modify_emitter');
    configurator_stream.emit('update', evt.feature);
  }
  // client configurator stream

  configurator_stream.listen('new_val', function update_client_from_fb (wkt_txt) {
    var geom, feat;
      console.log('notbusy',!$scope.draw_busy, 'txt', wkt_txt !== $scope.curr_wkt);
      console.log('wkt_txt', wkt_txt);
      console.log('$scope.curr_wkt', $scope.curr_wkt);

    if ( $scope.curr_wkt && !$scope.draw_busy && wkt_txt !== $scope.curr_wkt) {
      // geom = wkt.readGeometry(wkt_txt);
      feat = wkt.readFeature(wkt_txt);
      // set the feature's area property, which are read later by the Style function
      feat.set('area',  wkt.readGeometry(wkt_txt));
      feat.setGeometryName('area');
      // save the ref_key
      // feat.set('wkt_ref_id', ref.key());
      // add area to map
      !$scope.curr_wkt && LayerService.getLayer('area').getSource().addFeature(feat); // TODO: fix this
      // listen for changes on the ref
      // ref.ref().on('value', changeAreaFromFirebase);
      feat.on('change:start', draw_modify_emitter);
      feat.on('change:end', draw_modify_un_busy);

      Design.ref().update({area: wkt_txt})

      $scope.draw_busy = false;
    }
  })

  function draw_modify_un_busy(evt) {
    $scope.draw_busy = false;
    configurator_stream.emit('update', evt.feature);
  }







  /********************************************
   listeners on the map
  ********************************************/


  // Design.ref().child('area').on('child_added', firebaseListener);

// bugfix end /////////////////////////
// >>>>>>> Stashed changes
  // init the layers for the map

  function drawStartListen (event) {
    var feature = event.feature;
    console.log('drawing started getting new, empty wkt_ref');
    // get ref for feature
    var wkt_ref = Design.ref().child('area').push();
    feature.set('wkt_ref_id', wkt_ref.key());
    // save the ref in memory
    Sync.addSyncRef('area', wkt_ref);
    Design.ref().child('area').key()
  }

  function updateWhileModify (event) {
    var feature = event.target;
    var wkt_txt = wkt.writeGeometry(feature.getGeometry());
    wkt_ref.set(wkt_txt);
    // if (wkt_ref.val() !== wkt_txt) {
    //   console.log('updating area after draw')
    //   wkt_ref.set(wkt_txt);
    // }
  }

  // handle area added to firebase
  function firebaseListener (child_ref) {
    console.log('firebaseListener heard a feature get added');
    var wkt_ref_id = child_ref.key();
    var wkt_ref = Sync.getSyncRef('area', wkt_ref_id);
    if ( child_ref.val() === 'start_only') {
      console.log('but we will not add because only start');
      wkt_ref.ref().on('value', changeAreaFromFirebase);
    } else if (!wkt_ref) {
      console.log('it is new, so we sent it to the map');
      // the area doesn't exist yet, should be drawn
      addAreaFromFirebase(child_ref);
    } else {
      // the area exists, don't do shit
      console.log('that area exists already');
    }
  }

  /********************************************
   handle firebase updates
  ********************************************/

  // // add feature to source
  // function addAreaFromFirebase (ref) {
  //   var new_geom;
  //   var new_feat;
  //   console.log('now adding area from firebase');
  //   var new_wkt = ref.val();
  //   console.log('new_wkt', new_wkt);
  //   if (new_wkt !== 'start_only') {
  //     new_geom = wkt.readGeometry(new_wkt);
  //     new_feat = wkt.readFeature(new_wkt);

  //     // set the feature's area property, which are read later by the Style function
  //     new_feat.set('area', new_geom);
  //     new_feat.setGeometryName('area');
  //     // save the ref_key
  //     new_feat.set('wkt_ref_id', ref.key());
  //     // add area to map
  //     LayerService.getLayer('area').getSource().addFeature(new_feat);
  //     // listen for changes on the ref
  //     ref.ref().on('value', changeAreaFromFirebase);
  //     new_feat.on('change', updateWhileModify );
  //     Sync.addSyncRef('area', ref.ref());
  //   } else {
  //     console.log('we are still drawing');
  //   }
  // }

  function changeAreaFromFirebase (wkt_ref) {
    var new_wkt    = wkt_ref.val();
    var wkt_ref_id = wkt_ref.key();
    var area       = findFeatureByWktId(wkt_ref_id);
    var curr_wkt   = wkt.writeGeometry(area.getGeometry());
    // meaningful change?
    if (new_wkt === 'start_only') {
      console.log("we're still drawing");
    } else if (curr_wkt === new_wkt) {
      console.log('this area has not changed');
    } else {
      // change feature
      console.log('this area was changed by firebase');
      var new_geom = wkt.readGeometry(new_wkt);
      area.setGeometry(new_geom);
    }
  }

  function findFeatureByWktId (wkt_ref_id) {
    var area = area_source.getFeatures();
    var result;
    for (var i = 0; i < area.length; i++) {
      if (area[i].get('wkt_ref_id') === wkt_ref_id) {
        result = area[i];
      }
    }
    return result;
  }

  /********************************************
   handle source updates
  ********************************************/

  // update from client
  function addToFirebaseAfterDraw (area) {
    console.log('now adding to firebase with new area');
    // get the area's wkt_txt
    var wkt_txt = wkt.writeGeometry(area.getGeometry());
    // send the new wkt_txt to firebase
    var wkt_ref = Sync.getSyncRef('area', area.get('wkt_ref_id'));
    wkt_ref.set(wkt_txt);
    wkt_ref.on('value', changeAreaFromFirebase );
  }

  function addFeatureIfNecessary (area, wkt_ref) {
    // get current wkt_txt
    var wkt_txt = wkt.writeGeometry(area.getGeometry());
    var new_wkt = wkt_ref.val();
    var new_geom;
    if (new_wkt !== wkt_txt ) {
      // changed feature, update it
      console.log('changeing feature to match update from firebase');
      new_geom = wkt.readGeometry(new_wkt);
      area.setGeometry(new_geom);
    } else {
      // no change, don't do shit
      console.log('feature matches firebase');
    }
  }
}
