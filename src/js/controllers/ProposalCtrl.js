/* =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-

  Proposal Controller

  Controls the views of proposal data

=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=- */

controllers.controller('ProposalCtrl', ['URL_ROOT', '$location', '$scope', 'Session', 'Form', 'Clientstream', 'defaultValues', 'Proposal', ProposalCtrl_]);

function ProposalCtrl_ (URL_ROOT, $location, $scope, Session, Form, Client, defaultValues, Proposal) {
  var vm = this;
  vm.prospect = Form.prospect;

  var upfront_cost,
      annual_consumption,
      utility_rate,
      scty_rate,
      annual_production,
      first_year_savings,
      percent_savings,
      percent_solar,
      percent_utility,
      bill;

  calculateProposal();

  Proposal.rx_panel_count.subscribe(subProposalToPanelCount)

  // calculate annual production in $$ of electricity from panel fill API
  function subProposalToPanelCount (count) {
    // number of panels filled from Panelfill API
    vm.prospect().panelCount = count;

    // power of each panel
    vm.prospect().panelCapacity = defaultValues.panel_capacity;

    // system size in kW => number of panels * power of each panel
    vm.prospect().systemSize = (count * vm.prospect().panelCapacity) || defaultValues.system_size;

    // estimated production of that system in a year => power of system * yearly yield per kW in that region
    vm.prospect().annualProduction = (vm.prospect().systemSize * vm.prospect().averageYield) || defaultValues.annual_production; // kWh

    // save the new figures to Firebase
    Form.ref() && Client.emit('Form: valid data', {
      systemSize: vm.prospect().systemSize,
      annualProduction: vm.prospect().annualProduction,
      panelCapacity: vm.prospect().panelCapacity,
      averageYield: vm.prospect().averageYield
    });

    // once panel count is in, recalculate all figures
    calculateProposal();
  }

  function calculateProposal () {

    // calculate upfront cost
    upfront_cost = defaultValues.upfront_cost;
    vm.prospect().upfrontCost = upfront_cost;
    Form.ref() && Client.emit('Form: valid data', { upfrontCost: upfront_cost });

    // grab rate estimates from the Form object
    utility_rate = vm.prospect().utilityRate || defaultValues.utility_rate; // MedianUtilityPrice
    vm.prospect().utilityRate = utility_rate; // $

    scty_rate = vm.prospect().sctyRate || defaultValues.scty_rate; // FinancingKwhPrice
    vm.prospect().sctyRate = scty_rate; // $

    // calculate annual consumption in kWh of electricity from monthly bill estimate over 12 months divided by the rate
    bill = vm.prospect().bill;
    annual_consumption = ((bill * 12) / utility_rate) || defaultValues.annual_consumption; // kWh
    vm.prospect().annualConsumption = annual_consumption;
    Form.ref() && Client.emit('Form: valid data', { annualConsumption: annual_consumption });

    annual_production = vm.prospect().annualProduction;

    // calculate estimated first year savings from annual consumption and production estimates

    // if a prospect would offset less than 80% of their energy needs, first year savings are the yearly spend minus the offset costs at scty rate
    if (annual_production < (annual_consumption * 0.8)) {
      first_year_savings = annual_production * (utility_rate - scty_rate); // $/yr
    }
    // else if they could offset more than that, we make sure they don't
    else {
      first_year_savings = annual_consumption * .8 * (utility_rate - scty_rate); // $/yr
    }
    vm.prospect().firstYearSavings = first_year_savings;
    Form.ref() && Client.emit('Form: valid data', { firstYearSavings: first_year_savings });

    // calculate percentage of energy coming from solar

    // if the system significantly outsizes the customer's needs, don't let the chart look weird
    if (annual_consumption < annual_production) {
      percent_solar = defaultValues.percent_solar;
    }
    // if the system will produce less than 80% of the customer's energy needs, we'll calculate the percentage
    else if ((annual_production/annual_consumption) < 0.8) {
      percent_solar = 100 * annual_production / annual_consumption; // %
    }
    // if the system would produce more than 80%, we limit it at 80%
    else {
      percent_solar = defaultValues.percent_solar;
    }

    vm.prospect().percentSolar = percent_solar;
    Form.ref() && Client.emit('Form: valid data', { percentSolar: percent_solar });

    // calculate percentage of energy not coming from solar
    percent_utility = 100 - percent_solar;
    vm.prospect().percentUtility = percent_utility;
    Form.ref() && Client.emit('Form: valid data', { percentUtility: percent_utility });
    drawPowerChart();

    // create the sharelink
    share_link = [$location.protocol() ,
    "://",      URL_ROOT ,
    "#/share/", Session.id(),
    "/",        bill,
    "/",        utility_rate,
    "/",        scty_rate].join('');
    vm.prospect().share_link = share_link;
    Form.ref() && Client.emit('Form: valid data', {proposal_share_link: share_link});
  }

  function drawPowerChart () {
    var chartEl,
        charty,
        chartOpts;

    chartEl = document.getElementById('powerRatioChart').getContext('2d');
    chartOpts = {
      showTooltips: false
    };

    chartData = [
      {
        value: percent_solar,
        color: '#17c188',
        highlight: '#559933',
        label: 'Solar Power'
      },
      {
        value: percent_utility,
        color: '#FFFFFF',
        highlight: '#EFEFEF',
        label: 'Dirty Power'
      }
    ];

    charty = new Chart(chartEl).Pie(chartData, chartOpts);
  }
}
