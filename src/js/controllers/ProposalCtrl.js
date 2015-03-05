/* =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-

  Proposal Controller

  Bubbles up proposal data to the view

=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=- */

controllers.controller('ProposalCtrl', ['Form', 'Clientstream', ProposalCtrl_]);

function ProposalCtrl_ (Form, Client) {
  var vm = this;
  vm.prospect = Form.prospect;

  var upfront_cost,
      annual_consumption,
      utility_rate,
      scty_rate,
      annual_production,
      first_year_savings,
      percent_savings,
      percent_solar;

  upfront_cost = 0;
  annual_consumption = vm.prospect.bill * 12;
  utility_rate = vm.prospect.utility_rate; // MedianUtilityPrice
  scty_rate = vm.prospect.scty_rate; // FinancingKwhPrice


}
