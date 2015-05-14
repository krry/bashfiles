  /* =======================================================

	flnOmapButtons.js is the list of directives to enable/disable interactions
	available on the map

======================================================= */

directives
// erase a polygon
.directive('flnOmapClearPoly', ['Design', flnOmapClearPoly_] )
// step back from modify and erase the polygon you drew
.directive('flnOmapRedoModify', ['Clientstream', flnRedoModify_] )
// reset the draw interaction while the user is drawing
.directive('flnOmapResetDraw', ['Interactions', 'Layers', flnOmapResetDraw_] );

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

function flnOmapResetDraw_ (Interactions, Layers) {
  return {
    restrict: "A",
    controller: ['$scope', '$element', '$attrs', function ($scope, $element, $attrs) {
      $scope.tracing = false;
    }],
    link: function (scope, ele, attrs) {
      Layers.rx_drawcount.subscribe(showButtonIfTraced);

      ele.on('click', preventThatPoly);

      Interactions.rx.subscribe(showButtonOnDrawStart);
      Interactions.rx.subscribe(hideButtonOnReset);

      function hideButtonOnReset(msg) {
        if (msg === 'reset draw') {
          scope.tracing = false;
        }
      }

      function showButtonOnDrawStart (x) {
        if (x === 'drawing') {
          // let the user reset the drawing once they've started
          scope.tracing = true;
        }
      }
      function showButtonIfTraced(x) {
        // allow the user to reset the drawing if they want
        x && (scope.drawing = x);
      }

      function preventThatPoly (){
        Interactions.rx.onNext('reset draw');
        scope.drawing = false;
      }

      // ele.on('$destroy', function (scope, ele, attrs) {
      //   scope.show = false;
      // })
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
