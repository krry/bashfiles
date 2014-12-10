/* =======================================================

	flnOlMapUi is the list of directives to enable/disable interactions
	available on the map

	fln-draw
    * draw features on the map

  fln-select
    * ability to click features to select

  fln-modify
    * ability to change the shapes of features

  fln-dragpan
    * ability to click and drag the map on the screen

======================================================= */

directives
.directive('flnSelect', flnSelect_ )
.directive('flnDraw', flnDraw_ )
.directive('flnModify', flnModify_ )
.directive('flnDragpan', flnDragPan_ );

function flnSelect_ (InteractionService, MapService) {
  return {
    restrict: "EA",
    link: function flnSelectLink (scope, ele, attrs) {
      InteractionService.enable(InteractionService.get('select'));
      ele.on('$destroy', function selectDestroy (e) {
        InteractionService.disable(InteractionService.get('select'));
      });
    },
  };
}

function flnDraw_ (InteractionService, MapService) {
  return {
    restrict: "EA",
    link: function flnDrawLink (scope, ele, attrs) {
      InteractionService.enable(InteractionService.get('draw'));
      ele.on('$destroy', function drawDestroy (e) {
        InteractionService.disable(InteractionService.get('draw'));
      });
    },
  };
}

function flnModify_ (InteractionService, MapService, LayerService, StyleService) {
  return {
    restrict: "EA",
    link: function flnModifyLink (scope, ele, attrs) {
      InteractionService.enable(InteractionService.get('modify'));
      LayerService.getLayer('area').setStyle(StyleService.highlightStyleFunction);
      ele.on('$destroy', function modifyDestroy (e) {
        InteractionService.disable(InteractionService.get('modify'));
        LayerService.getLayer('area').setStyle(StyleService.defaultStyleFunction);
      });
    },
  };
}

function flnDragPan_ (InteractionService, MapService) {
  return {
    restrict: "EA",
    link: function flnDragPanLink (scope, ele, attrs) {
      InteractionService.enable(InteractionService.get('dragpan'));
      ele.on('$destroy', function dragPanDestroy (e) {
        InteractionService.disable(InteractionService.get('dragpan'));
      });
    },
  };
}
