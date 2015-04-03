/* =======================================================

	flnOlMapUi is the list of directives to enable/disable interactions
	available on the map

	fln-draw
    * draw features on the map

  fln-modify
    * ability to change the shapes of features

  fln-zoom
    * ability to wheel zoom on map

  fln-dragpan
    * ability to click and drag the map on the screen

======================================================= */

directives
.directive('flnDraw', ['newConfigurator', flnDraw_] )
.directive('flnModify', ['newConfigurator', flnModify_] )
.directive('flnZoom', ['newConfigurator', flnZoom_] )
.directive('flnDragpan', ['newConfigurator', flnDragPan_] )
.directive('flnOmapClearPoly', ['Design', flnOmapClearPoly_] );

function flnDraw_ (newConfigurator, Clientstream) {
  return {
    restrict: "EA",
    link: function flnDrawCtrl (scope, element, attrs) {
      var tips, tip_step, listener_key;
      listner_key = newConfigurator.drawAdd();

      function addDrawTips(){
      // TODO: this should be it's own directive
      //   // dev //
      //   var map_div = $('#omap');
      //   // end:dev //
      //   Configurator.enable('draw');
      //   // track the step the user is on
      //   tip_step = 0;
      //   // tip options
      //   tips = [
      //     "click to begin, brah",
      //     "keep clickin', brah",
      //     "close up that shape, brah",
      //   ];
      //
      //   // listen for clicks on the map...
      //   $scope.tip_text = tips[tip_step];
      //
      //   listener_key = Configurator.map().on('click',  function() { // save the listener for $destroy
      //     console.log($scope.tip_text);
      //     /* jshint -W030 */
      //     tip_step < tips.length -1 && tip_step++;
      //     /* jshint +W030 */
      //     $scope.tip_text = tips[tip_step];
      //     $element.find('fln-follow-tip').attr('tip', $scope.tip_text);
      //     if (!$scope.$phase) $scope.$apply();
      //   });
      //
      //   /* TODO: fix tool-tip. currently makes the map gray.
      //   compile && add that beastly tooltip div
      //   map_div.attr('fln-follow-tip', true);
      //   map_div.attr('tip-text', '{{tip_text}}');
      //   */
      //   $compile(map_div)($scope);
      }

      element.on('$destroy', function drawDestroy (e) {
        newConfigurator.drawDel();
      });
    },
  };
}

function flnModify_ (newConfigurator) {
  return {
    restrict: "EA",
    link: function flnModifyLink (scope, ele, attrs) {
      newConfigurator.modifyAdd();
      ele.on('$destroy', function modifyDestroy (e) {
        newConfigurator.modifyDel();
      });
    },
  };
}

function flnZoom_ (newConfigurator) {
  return {
    restrict: "EA",
    link: function flnZoomLink (scope, ele, attrs) {
      newConfigurator.zoomAdd();
      ele.on('$destroy', function modifyDestroy (e) {
        newConfigurator.zoomDel();
      });
    },
  };
}

function flnDragPan_ (newConfigurator) {
  return {
    restrict: "EA",
    link: function flnDragPanLink (scope, ele, attrs) {
      $('div[fln-configurator]').addClass('crosshair')
      newConfigurator.dragpanAdd();
      ele.on('$destroy', function dragPanDestroy (e) {
        $('div[fln-configurator]').removeClass('crosshair')
        newConfigurator.dragpanDel();
      });
    },
  };
}

function flnOmapClearPoly_ (Design) {
  return {
    restrict: "A",
    link: function (scope, ele, attrs) {
      ele.on('click', function popThatPoly(){
        Design.rx_areas.onNext('removed by client');
      })
    },
  };
}
