  /* =======================================================

	flnOmapButtons.js is the list of directives to enable/disable interactions
	available on the map

======================================================= */

directives
// erase a polygon
.directive('flnOmapClearPoly', ['Design', flnOmapClearPoly_] )
// step back from modify and erase the polygon you drew
.directive('flnOmapRedoModify', ['Clientstream','Design', flnRedoModify_] )
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
      scope.tracing = false;

      Layers.rx_drawcount.subscribe(showButtonIfTraced);
      Interactions.rx.subscribe(showButtonOnDrawStart);

      ele.on('click', preventThatPoly);
      ele.on('$destroy', setInteractionStreamToNull);

      function showButtonOnDrawStart (x) {
        if (x === 'drawing') {
          // let the user reset the drawing once they've started
          scope.tracing = true;
          $(ele.parent()).addClass('pair');
        }
      }

      function showButtonIfTraced(x) {
        // allow the user to reset the drawing if they want
        if (!!x) {
          scope.tracing = true;
          $(ele.parent()).addClass('pair');
        } else {
          scope.tracing = false;
          $(ele.parent()).removeClass('pair');
        }
      }

      function preventThatPoly (){
        Interactions.rx.onNext('reset draw');
        scope.tracing = false;
        $(ele.parent()).removeClass('pair');
      }

      function setInteractionStreamToNull(scope, ele, attrs) {
        // Interactions.rx is a behavior subject, so it retains it's last value.
        // prevent the redo button from detecting 'drawing' when
        // returning to this step by way of flnRedoModify
        Interactions.rx.onNext(null);
      }
    },
  };
}

function flnRedoModify_ (Client, Design) {
  return {
    restrict: "A",
    link: function (scope, ele, attrs) {
      ele.on('click', function returnToModify() {
        Design.rx_areas.onNext('removed by client');
        Client.emit('Stages: jump to step', 'trace-area');
      })
    }
  }
}
