/* =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-

  Share Controller

  Controls the views of shared proposal

=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=- */

controllers.controller('ShareCtrl', ['Clientstream', 'defaultValues', '$stateParams', 'Proposal', ShareCtrl_]);

function ShareCtrl_ (Client, defaultValues, $stateParams, Proposal) {

  // http://localhost:8100/flannel#/share/-JkzqbNe6y7UJr7ebTCu/100/0.2233/0.15
  var vm = this;
  vm.numbers = {};

  var upfront_cost,
      annual_consumption,
      utility_rate,
      scty_rate,
      annual_production,
      first_year_savings,
      percent_savings,
      percent_solar,
      percent_utility,
      bill,
      ceiling;

  Proposal.rx_panel_count.subscribe(subProposalToPanelCount)

  // calculate annual production in $$ of electricity from panel fill API
  function subProposalToPanelCount (count) {
    // number of panels filled from Panelfill API
    vm.numbers.panelCount = count;

    // power of each panel
    vm.numbers.panelCapacity = defaultValues.panel_capacity;

    // number of panels filled from Panelfill API
    vm.numbers.systemSize = (count * vm.numbers.panelCapacity) || defaultValues.system_size;

    // gather average yield from params
    vm.numbers.averageYield = $stateParams.averageYield;

    // estimated production of that system in a year => power of system * yearly yield per kW in that region
    vm.numbers.annualProduction = vm.numbers.systemSize * vm.numbers.averageYield || defaultValues.annual_production;

    calculateProposal();
  }

  function calculateProposal () {
    ceiling = defaultValues.ceiling;
    // calculate upfront cost
    vm.numbers.upfrontCost = defaultValues.upfront_cost;

    // grab rate estimates from the Form object
    utility_rate = $stateParams.utilityRate || defaultValues.utility_rate; // MedianUtilityPrice
    vm.numbers.utilityRate = utility_rate;

    // calculate annual consumption in $$ of electricity from monthly bill estimate
    bill = $stateParams.bill || defaultValues.bill;
    vm.numbers.bill = bill;
    annual_consumption = ((bill * 12) / utility_rate) || defaultValues.annual_consumption; // kWh
    vm.numbers.annualConsumption = annual_consumption;
    annual_production = vm.numbers.annualProduction;

    scty_rate = $stateParams.sctyRate || defaultValues.scty_rate; // FinancingKwhPrice
    vm.numbers.sctyRate = scty_rate;

    // calculate estimated first year savings from annual consumption and production estimates
    // if a prospect would offset less than 80% of their energy needs, first year savings are
    // the yearly spend minus the offset costs at scty rate
    if (annual_production < (annual_consumption * ceiling)) {
      first_year_savings = annual_production * (utility_rate - scty_rate); // $/yr
    }
    // else if they could offset more than that, we make sure they don't
    else {
      first_year_savings = annual_consumption * ceiling * (utility_rate - scty_rate); // $/yr
    }
    vm.numbers.firstYearSavings = first_year_savings;

    // calculate percentage of energy coming from solar
    // if the system significantly outsizes the customer's needs, don't let the chart look weird
    if (annual_consumption < annual_production) {
      percent_solar = defaultValues.percent_solar;
    }
    // if the system will produce less than 80% of the customer's energy needs, we'll calculate the percentage
    else if ((annual_production/annual_consumption) < ceiling) {
      percent_solar = 100 * annual_production / annual_consumption; // %
    }
    // if the system would produce more than 80%, we limit it at 80%
    else {
      percent_solar = defaultValues.percent_solar;
    }

    vm.numbers.percentSolar = percent_solar;

    // calculate percentage of energy not coming from solar
    percent_utility = 100 - percent_solar;
    vm.numbers.percentUtility = percent_utility;

    drawPowerChart();
  }

  function drawPowerChart () {
    var chartEl,
        charty,
        chartOpts;

    chartEl = document.getElementById('power_ratio_chart').getContext('2d');
    chartOpts = {
      showTooltips: false,
      segmentShowStroke: false,
      segmentStrokeWidth: 0,
      animation: false
    };

    chartData = [
      {
        value: percent_solar,
        color: '#00B675',
        highlight: '#559933',
        label: 'Solar Power'
      },
      {
        value: percent_utility,
        color: '#dddddd',
        highlight: '#EFEFEF',
        label: 'Dirty Power'
      }
    ];

    charty = new Chart(chartEl).Pie(chartData, chartOpts);
  }
}
