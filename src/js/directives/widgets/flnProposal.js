directives.directive('flnProposal', [flnProposal_]);

function flnProposal_ () {
  return {
    restrict: 'A',
    controller: 'ProposalCtrl',
    controllerAs: 'proposal'
  };
}
