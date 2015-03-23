/* ==================================================

  flnPanelfill

  a directive used to create a Google Map with panels on it.

================================================== */

directives.directive('flnPanelfill', [flnPanelfill_]);

function flnPanelfill_ () {
  return {
    restrict: "A",
    controller: function ($scope, $element, $attrs, Proposal) {
      Proposal.setTarget();
    },
    templateUrl: 'templates/directives/olmap/flnPanelfill.html',
  };
}
