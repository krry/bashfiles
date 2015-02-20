/* ==================================================

Area slope selector

this directive enables opens a layer that:
  * lets the user set the

<fln-areapeak area="focused_area"></fln-areapeak>

================================================== */

directives.directive('flnSlopeSelect', ["$compile", "Design", "Clientstream", flnSlopeSelect_]);

function flnSlopeSelect_ ($compile, Design, Client) {
  return {
    restrict: 'EA',
    controllerAs: 'SlopeSelect',
    transclude: true,
    templateUrl: "templates/directives/olmap/flnSlopeSelect.html",
    scope: {

    },
    controller: function flnSlopeSelectController ($scope, $element, $attrs) {
      $scope.slope_options = [40, 25, 10, 0]; // hack: hardcode
      $scope.selected = 0;


      // if (Configurator.map()) {
      //   // already loaded map
      //   buildRoofpeakoverla();
      // } else {
      //   // wait for map to hotload
      //   console.log('flnDraw, configurator not ready');
      //   Clientstream.listen('Configurator: Map ready', buildRoofpeakoverla);
      // }

      // load the feature for slope values
      var feature = Design.areas_ref().child('area'); // hack: this is hardcode
      Client.listen('feature slope', function() {
        feature.update({slope: $scope.selected});
      })

      // when a user selects one, save that detail to firebase
      $scope.setslope = function butts () {
        Client.emit('feature slope', '// hack:');
      }

      $element.on('$destroy', function () {
        console.log('should remove the SlopeSelect now');
        // save details to Design (?)
      });
    }
  };
}
