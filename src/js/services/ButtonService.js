// these will go to the button interactions
// .directive('flnClickZoom', flnZoom_ )
// .directive('flnClickPan', flnClickPan_ )
  // fln-click-zoom
  //   turns on scroll zoom interaction
  //   add template to the map controls
  //   $destroy
  //     remove zoom from map
  //     remove controls


      // var handleMountButton = function handleMountButton(e){
      //   if (e) {
      //     e.preventDefault();
      //   }

      //   var removeUs = [drawObstruction, modifyInteraction];
      //   var addUs    = [drawMount, selectInteraction];
      //   addAndRemoveInteractions(addUs, removeUs, map);
      // };

      // var handleObstructionButton = function handleObstructionButton(e) {
      //   if (e) {
      //     e.preventDefault();
      //   }

      //   var removeUs = [drawMount, selectInteraction, modifyInteraction];
      //   var addUs    = [drawObstruction, selectInteraction];
      //   addAndRemoveInteractions(addUs, removeUs, map);
      // };

      // var handleSelectButton = function handleSelectButton (e) {
      //   if (e) {
      //     e.preventDefault();
      //   }
      //   var removeUs = [drawMount, drawObstruction, selectInteraction, modifyInteraction];
      //   var addUs    = [selectInteraction, modifyInteraction];
      //   addAndRemoveInteractions(addUs, removeUs, map);
      // };

      // var handleDeleteButton = function handleDeleteButton(e) {
      //     if (e) {
      //         e.preventDefault();
      //     }

      //     var layer;
      //     var feature = Ol.getSelectedFeature()[0];

      //     if (!!feature && feature.getGeometryName() === 'mount') {
      //         layer = Ol.layers.mount;
      //         Ol.removeFeatureById(feature.getId(), layer);
      //         layer = Ol.layers.panel;
      //         Ol.removeFeatureById(feature.getId(), layer);
      //         layer = Ol.layers.gutter;
      //         Ol.removeFeatureById(feature.getId(), layer);
      //     }
      //     else if (!!feature && feature.getGeometryName() === 'panel') {
      //         layer = Ol.layers[feature.getGeometryName()];
      //         layer.removeFeature(feature);
      //     }
      //     else if (!!feature && feature.getGeometryName() === 'obstruction') {
      //         layer = Ol.layers[feature.getGeometryName()];
      //         layer.removeFeature(feature);
      //     }

      //     if (Ol.selectInteraction.getFeatures().getArray().length !== 0) {
      //       Ol.selectInteraction.getFeatures().clear(); //HACK: eliminate residual touch/mouse points
      //     }
      //     handleSelectButton();
      // };

      // /* controller button options */
      // function defaultCb (argument) {
      //   // body...
      // }
      // var button_options = {
      //   mount_button: {
      //     callback:     handleMountButton,
      //     target:       drawbutton,
      //   },
      //   obstruction_button: {
      //     callback:     defaultCb,
      //     target:       obstructionbutton,
      //   },
      //   select_button: {
      //     callback:     handleSelectButton,
      //     target:       selectbutton,
      //   },
      //   delete_button: {
      //     callback:     handleDeleteButton,
      //     target:       deletebutton,
      //   },
      //   toggle_button: {
      //     callback:     defaultCb,
      //     target:       togglebutton,
      //   },
      // };

      // angular.forEach(button_options, function(val, key) {
      //   new DrawControlButton(val);
      // });

      // function mountDrawStart(){
      //   var removeUs = [modifyInteraction, selectInteraction];
      //   addAndRemoveInteractions([], removeUs, map);
      // }
      // function mountDrawEnd(event){
      //   var feature = event.feature;
      //   var removeUs = [];
      //   var addUs    = [selectInteraction, modifyInteraction];
      //   addAndRemoveInteractions(addUs, removeUs, map);
      //   feature.setId(Ol.idSeed++);
      //   selectInteraction.getFeatures().push(feature);
      //   Ol.gutterLineFinder(event);
      // }
      // drawMount.on('drawend', mountDrawEnd, scope.featureDetails);
      // drawMount.on('drawstart', mountDrawStart, scope.featureDetails);

      // selectInteraction.getFeatures().on('change:length', function (event) {
      //   scope.focusedFeature = event.target.getArray()[0];
      //   angular.forEach(conditional_buttons, function(b){
      //     if (scope.focusedFeature) {
      //       b.removeClass('disabled');
      //     } else {
      //       b.addClass('disabled');
      //     }
      //   });
      // });
