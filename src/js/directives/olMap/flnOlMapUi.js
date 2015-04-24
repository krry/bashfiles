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
  var listner_key;
  return {
    restrict: "EA",
    link: function flnDrawCtrl (scope, element, attrs) {
      var tips, tip_step, listener_key;
      listner_key = newConfigurator.drawAdd();

      element.on('$destroy', function drawDestroy (e) {
        newConfigurator.drawDel();
        newConfigurator.configurator().then(function (map) {
          map.unByKey(listener_key);
        })
      });
    },
    controller: ['$scope', '$element', '$compile', 'TOOL_TIP_TEXT', function addDrawTips($scope, $element, $compile, TOOL_TIP_TEXT){

      // give the user a tooltip on their mouse
      var tip_div = $element.find('fln-follow-tip');
      tip_step = 0;
      tips = TOOL_TIP_TEXT;
      $scope.tip_text = tips[tip_step];

      // listen for clicks on the map...
      // save the listener_key for $destroy
      listener_key = newConfigurator.configurator().then(function (mp) {
        mp.on('click',  function() {
          tip_step < tips.length -1 && tip_step++;
          $scope.tip_text = tips[tip_step];
          tip_div.attr('tip', $scope.tip_text);
          if (!$scope.$$phase) $scope.$apply();
        });

        // compile && add that beastly tooltip to the mouse
        tip_div.attr('fln-follow-tip', true);
        tip_div.attr('tip-text', '{{tip_text}}');
        $compile(tip_div)($scope);
      })
    }]
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
