function MapCtrl_($scope, MapService, LayerService, InteractionService, EventService, SyncService) {
  var vm = this;

  var Map = MapService.getOmap();

  var interactions = InteractionService.get('all');


  // TODO: service this
  // wkt turns feature.getGeometry() into text, text into geometyr for
  // feature.setGeometry()
  var wkt = new ol.format.WKT();


  // sync areas to firebase after they're added
  var area_source = LayerService.get('area').getSource()
  area_source.on('addfeature', function (event) {
    var feature = event.feature
    // get area wkt
    var txt = wkt.writeFeature(feature.getGeometry());
    // sync area wkt
    var syncObj = syncData(txt).$asObject();
    syncObj.$loaded()
      .then(function() {
        console.log("new area has id", syncObj.$id);
        // listen for changes
          // fb change updates area
          syncObj.on('change', EventService.syncModifyDown ); // TODO: how's this work?
          // area change updates fb
          feature.on('change', EventService.syncModifyUp ); // TODO: how's this work
      });
    })
  });
}
controllers.controller("MapCtrl", MapCtrl_);
