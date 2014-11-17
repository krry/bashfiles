function MapCtrl_($scope, $firebase, MapService, LayerService, InteractionService, EventService, SyncService, syncData, updateArea, addArea, firebaseRef) {
  var vm = this;

  // add areas array to the design in firebase
  var designKey = SyncService.get('designRef').key();
  $scope.areasUrl = SyncService.designObj(designKey).$ref().path + '/areas';

  var designAreas = firebaseRef($scope.areasUrl);
  SyncService.set('areas', designAreas);
  designAreas.on('child_added', function (child) {
    console.log('child added', child.val());

    // var childRef = child.ref();
    // // watch the child for changes
    // childRef.on('value',function fbChangeEvent (child) {
    //   debugger;
    //   var area = SyncService.getAreaById(child.key());
    //   if (!area) return;
    //   var listen = area.get('fblisten')
    //   var prevWkt = area.get('wktTxt');
    //   if (listen) area.unByKey(listen);
    //   var newVal = child.val()
    //   if (prevWkt === newVal) {
    //     return;
    //   } else {
    //     console.log('setting new value', newVal);
    //     var newGeom = wkt.readGeometry(newVal);
    //     area.setGeometry(newGeom);
    //   }
    //   var listen = area.on('change',function areaChangeEvent(event) {
    //     var area = event.target;
    //     var featureText = wkt.writeGeometry(area.getGeometry());
    //     area.set('wktTxt', featureText);
    //     EventService.modifyref(SyncService.getAreaById(child.key()), featureText);
    //   });
    //   area.set('fblisten', listen);
    // })
  })

  // TODO: service this
  // wkt allows us to turn feature.getGeometry() into text, text into geometry for
  // use with feature.setGeometry()
  var wkt = new ol.format.WKT();

  // sync areas to firebase after they're added to the map
  var area_source = LayerService.get('area').getSource();
  area_source.on('addfeature', function addAreaAfterDraw (event) {
    var area = event.feature
    debugger;
    console.log('area added to source', area);
    // get area wkt as txt
    var wktTxt = wkt.writeGeometry(area.getGeometry());
    // add wkt to firebase
    var wktRef = addWkt(designAreas, wktTxt);

    SyncService.addAreaObj(area, wktRef.key());
    area.setId(wktRef.key());
    wktRef.on('value', function syncFromFb () {
      var listen = area.get('fblisten')
      var prevWkt = area.get('wktTxt');
      if (listen) area.unByKey(listen);
      var newVal = child.val()
      if (prevWkt === newVal) {
        return;
      } else {
        console.log('setting new value', newVal);
        var newGeom = wkt.readGeometry(newVal);
        area.setGeometry(newGeom);
      }
      var listen = area.on('change',function areaChangeEvent(event) {
        var area = event.target;
        var featureText = wkt.writeGeometry(area.getGeometry());
        area.set('wktTxt', featureText);
        EventService.modifyref(SyncService.getAreaById(child.key()), featureText);
      });
      area.set('fblisten', listen);
    })

    var listen = area.on('change', function (event) {
      var newarea = event.target;
      var featureText = wkt.writeGeometry(newarea.getGeometry());
      newarea.set('wktTxt', featureText);
      // update fb with changes from client
      EventService.modifyref(SyncService.getAreaById(wktRef.key()), featureText);
    });
    area.set('fblisten', listen)
  });
}
controllers.controller("MapCtrl", MapCtrl_);
