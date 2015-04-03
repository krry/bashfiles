/* ==================================================

  flnPanelfill

  a directive used to create a Google Map with panels on it.

================================================== */

directives.directive('flnPanelfill', ['$stateParams', 'Proposal', flnPanelfill_]);

function flnPanelfill_ ($stateParams, Proposal) {
  return {
    restrict: "A",
    controller: function () {
      Proposal.setTarget($stateParams.design_key);
    },
    templateUrl: 'templates/directives/olmap/flnPanelfill.html',
  };
}
