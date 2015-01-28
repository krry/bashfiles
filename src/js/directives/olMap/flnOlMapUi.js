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
// .directive('flnSelect', flnSelect_ )
.directive('flnDraw', flnDraw_ )
.directive('flnModify', flnModify_ )
.directive('flnDragpan', flnDragPan_ );

// function flnSelect_ (InteractionService, MapService) {
//   return {
//     restrict: "EA",
//     link: function flnSelectLink (scope, ele, attrs) {
//       InteractionService.enable(InteractionService.get('select'));
//       ele.on('$destroy', function selectDestroy (e) {
//         InteractionService.disable(InteractionService.get('select'));
//       });
//     },
//   };
// }

function flnDraw_ ($timeout, $compile, Configurator, Clientstream) {
  return {
    restrict: "EA",
    controller: function flnDrawCtrl ($scope, $element, $attrs) {

      var tips, tip_step, listener_key;
      // dev //
      var map_div = $('#omap');
      // end:dev //
      Configurator.enable('draw');

      // track the step the user is on
      tip_step = 0;
      // tip options
      tips = [
        "click to begin, brah",
        "keep clickin', brah",
        "close up that shape, brah",
      ];

      $scope.tip_text = tips[tip_step];

      // listen for clicks on the map...

      listener_key = Configurator.map().on('click',  function() { // save the listener for $destroy
        console.log($scope.tip_text);
        /* jshint -W030 */
        tip_step < tips.length -1 && tip_step++;
        /* jshint +W030 */
        $scope.tip_text = tips[tip_step]
        map_div.attr('tip-text', $scope.tip_text);
        $scope.$apply();
      });

      // compile && add that beastly tooltip div
      // map_div.attr('fln-follow-tip', true);
      // map_div.attr('tip-text', '{{tip_text}}');
      $compile(map_div)($scope);

      $element.on('$destroy', function drawDestroy (e) {
        Configurator.disable('draw');
        Configurator.map().unByKey(listener_key) // remove the listener afterwards
      });
    },
  };
}

function flnModify_ (Configurator) {
  return {
    restrict: "EA",
    link: function flnModifyLink (scope, ele, attrs) {
      Configurator.enable('modify');
      // LayerService.getLayer('area').setStyle(StyleService.highlightStyleFunction);
      ele.on('$destroy', function modifyDestroy (e) {
        Configurator.disable('modify');
        // LayerService.getLayer('area').setStyle(StyleService.defaultStyleFunction);
      });
    },
  };
}

function flnDragPan_ (Configurator) {
  return {
    restrict: "EA",
    link: function flnDragPanLink (scope, ele, attrs) {
      Configurator.enable('dragpan');
      ele.on('$destroy', function dragPanDestroy (e) {
        Configurator.disable('dragpan');
      });
    },
  };
}
