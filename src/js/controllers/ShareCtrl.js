/* =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-

  Proposal Controller

  Controls the views of proposal data

=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=- */

controllers.controller('ShareCtrl', ['Clientstream', 'defaultValues', '$stateParams', ShareCtrl_]);

function ShareCtrl_ (Client, defaultValues, $stateParams) {

  console.log($stateParams.design_ref_key)

  // http://localhost:8100/flannel#/share/-JkzqbNe6y7UJr7ebTCu/100/0.2233/0.15
  var vm = this;
  vm.prospect = {};

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

  console.debug('defaults', defaultValues);
  calculateProposal();

  function calculateProposal () {
    // calculate upfront cost
    upfront_cost = defaultValues.upfront_cost;
    vm.prospect.upfrontCost = upfront_cost;


    // calculate annual consumption in $$ of electricity from monthly bill estimate
    bill = $stateParams.bill;
    annual_consumption = (bill * 12) || defaultValues.annual_consumption;
    vm.prospect.annualConsumption = annual_consumption;


    // calculate annual production in $$ of electricity from panel fill API
    // annual_production = vm.prospect.annualProduction;
    annual_production = defaultValues.annual_production;
    vm.prospect.annualProduction = annual_production;


    // grab rate estimates from the Form object
    utility_rate = $stateParams.utilityRate || defaultValues.utility_rate; // MedianUtilityPrice
    vm.prospect.utilityRate = utility_rate;

    scty_rate = $stateParams.sctyRate || defaultValues.scty_rate; // FinancingKwhPrice
    vm.prospect.sctyRate = scty_rate;

    // calculate estimated first year savings from annual consumption and production estimates
    // first_year_savings = (annual_production < annual_consumption * 0.8) ? (bill * 12) - (annual_production * scty_rate) : (bill * 12) - (annual_consumption * 0.8 * scty_rate);
    if (annual_production < annual_consumption * 0.8) {
      first_year_savings = annual_consumption - (annual_production * scty_rate);
    } else {
      // first_year_savings = (bill * 12) - (annual_consumption * 0.8 * scty_rate);
      // first_year_savings = (bill * 12) - (bill * 12 * 0.8 * scty_rate);
      first_year_savings = annual_consumption * 0.2 * scty_rate;
    }
    vm.prospect.firstYearSavings = first_year_savings;


    // calculate percentage of energy coming from solar
    // percent_solar = ((annual_production / annual_consumption) < 0.8) ? annual_production * 100 / annual_consumption : 80;
    if ((annual_production/annual_consumption) > 0.8) {
      percent_solar = annual_production * 100 / annual_consumption;
    } else percent_solar = defaultValues.percent_solar;
    vm.prospect.percentSolar = percent_solar;


    // calculate percentage of energy not coming from solar
    percent_utility = 100 - percent_solar;
    vm.prospect.percentUtility = percent_utility;


    drawPowerChart();
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
        color: '#008752',
        highlight: '#559933',
        label: 'Solar Power'
      },
      {
        value: percent_utility,
        color: '#FFFFFF',
        highlight: '#EFEFEF',
        label: 'Dirty Power'
      }
    ]

    charty = new Chart(chartEl).Pie(chartData, chartOpts);
  }
}
