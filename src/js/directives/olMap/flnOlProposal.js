/* ==================================================

  flnOlProposal

  a directive used to create an OpenLayers map

  TODO:
    * sync itself with firebase on '$destroy'

================================================== */

directives.directive('flnOlProposal', [flnOlProposal_]);

function flnOlProposal_ () {
  return {
    restrict: "A",
    controller: function ($scope, $element, $attrs, Proposal) {
      Proposal.setTarget();
    },
    templateUrl: 'templates/directives/olmap/flnOlProposal.html',
  };
}
