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
.directive('flnOmapClearPoly', ['Design', flnOmapClearPoly_] )
.directive('flnOmapRedoModify', ['Clientstream', flnRedoModify_] );

function flnDraw_ (newConfigurator) {
  var listener_key;
  return {
    restrict: "EA",
    require: "flnDraw",
    link: function flnDrawCtrl (scope, element, attrs, dCtrl) {
      newConfigurator.drawAdd();

      function mapClickToolTipStuff() {
        // when the configurator is clicked, advance the tooltip
        dCtrl.incrementTooltip();
      }

      newConfigurator.configurator().then(function (mp) {
        // HACK: we're using the promise to cause the directive to wait.
        // however, we don't actually use the promise object. this will break.
        listener_key = $(maps.omap.getViewport()).on('click', mapClickToolTipStuff )
        dCtrl.setTooltipStep(0);
        dCtrl.setActive();
      });

      element.on('$destroy', function drawDestroy (e) {
        newConfigurator.drawDel();
        newConfigurator.configurator().then(function (map) {
          // HACK: we're using the promise to cause the directive to wait.
          // however, we don't actually use the promise object. this will break.
          dCtrl.setInactive();
          $(maps.omap.getViewport()).off('click', mapClickToolTipStuff )
        })
      });

    },
    controller: ['$scope', '$element', '$compile', 'TOOL_TIP_TEXT', function addDrawTips($scope, $element, $compile, TOOL_TIP_TEXT){
      var tip_step = 0;
      var tip_div = $element.find('fln-follow-tip');
      tips = TOOL_TIP_TEXT;

      this.setActive = function () {
        // compile && add that beastly tooltip to the mouse
        tip_div.attr('fln-follow-tip', true);
        tip_div.attr('tip-text', '{{tip_text}}');
        $compile(tip_div)($scope);
      }

      this.setInactive = function () {
        // add that beastly tooltip to the mouse
        tip_div.attr('fln-follow-tip', false);
        $compile(tip_div)($scope);
      }

      this.setTooltipStep = function (step_number) {
        tip_step = step_number;
        $scope.tip_text = tips[tip_step];
        if (!$scope.$$phase) $scope.$apply();
      }

      // change tooltip text
      this.incrementTooltip = function () {
        tip_step < tips.length -1 && tip_step++;
        $scope.tip_text = tips[tip_step];
        tip_div.attr('tip', $scope.tip_text);
        if (!$scope.$$phase) $scope.$apply();
      }
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

function flnRedoModify_ (Client) {
  return {
    restrict: "A",
    link: function (scope, ele, attrs) {
      ele.on('click', function returnToModify() {
        Client.emit('Stages: jump to step', 'edit-area');
      })
    }
  }
}
