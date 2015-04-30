/* =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-

  Proposal Controller

  Controls the views of proposal data

=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=- */

controllers.controller('ProposalCtrl', ['URL_ROOT', '$location', '$scope', '$state', 'Session', 'Form', 'Clientstream', 'ModalService', 'defaultValues', 'Proposal', ProposalCtrl_]);

function ProposalCtrl_ (URL_ROOT, $location, $scope, $state, Session, Form, Client, Modal, defaultValues, Proposal) {
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
      bill,
      ceiling,
      share_link,
      average_yield;

  vm.changeDesign = changeDesign;
  vm.toggleSave = toggleSave;
  vm.save = false;
  vm.sendEmail = sendEmail;

  function sendEmail() {
    Client.emit('Modal: email submitted', vm.prospect().email);
    toggleSave();
  }

  function toggleSave () {
    vm.save = !vm.save;
  }

  calculateProposal();

  $scope.$watch(function(scope) { return vm.prospect() }, calculateProposal);

  // track map_center to keep the sharelink functional
  var share_map_center = {}
  // handle cases where the user's response
  Client.listen('Modal: empty panelfill', handleZeroPanelsModal);

  Proposal.rx_panel_count.subscribe(subProposalToPanelCount)

  function handleZeroPanelsModal (result) {
    // close the modal
    Modal.set(false);
    if (result === 'restart design') {
      return changeDesign();
    } else if (result === 'skip design') {
      vm.prospect().skipped = true;
      Client.emit('Form: valid data', { skipped: true });
      Client.emit('Stages: jump to stage', 'flannel.signup');
    }
  }

  // allow user to change their design
  function changeDesign() {
    // HACK: temp solution until we lock down the states & stages
    // destroy old geometry, then go to beginning of configurator
    // This can lead to case where user clicks "change"
    // then clicks "BACK" on the browser, and returns to a proposal
    // with no maps.
    Session.ref().parent().parent().child('designs')
    .child(Session.ref().key())
    .child('areas')
    .set(null);
    // go to beginning of configurator.
    Client.emit('Stages: stage', {stage: 1, step: 0});
  }
  // calculate annual production in $$ of electricity from panel fill API
  function subProposalToPanelCount (count) {
    if (count === 0 ) {
      // user created design with no panels. we should fail beautifully...
      Modal.set(true);
      return Modal.activate('empty-panelfill');
    }
    // number of panels filled from Panelfill API
    vm.prospect().panelCount = count;

    // power of each panel
    vm.prospect().panelCapacity = defaultValues.panel_capacity;

    // system size in kW => number of panels * power of each panel
    vm.prospect().systemSize = (count * vm.prospect().panelCapacity) || defaultValues.system_size;

    // cache average yield from rates API
    average_yield = vm.prospect().averageYield;

    // estimated production of that system in a year => power of system * yearly yield per kW in that region
    vm.prospect().annualProduction = (vm.prospect().systemSize * vm.prospect().averageYield) || defaultValues.annual_production; // kWh

    // save the new figures to Firebase
    Form.ref() && Client.emit('Form: valid data', {
      panelCount: vm.prospect().panelCount,
      systemSize: vm.prospect().systemSize,
      annualProduction: vm.prospect().annualProduction,
      panelCapacity: vm.prospect().panelCapacity,
      averageYield: vm.prospect().averageYield
    });

    // once panel count is in, recalculate all figures
    calculateProposal();
  }

  function calculateProposal () {
    ceiling = defaultValues.ceiling;
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
    if (annual_production < (annual_consumption * ceiling)) {
      first_year_savings = annual_production * (utility_rate - scty_rate); // $/yr
    }
    // else if they could offset more than that, we make sure they don't
    else {
      first_year_savings = annual_consumption * ceiling * (utility_rate - scty_rate); // $/yr
    }
    vm.prospect().firstYearSavings = first_year_savings;
    Form.ref() && Client.emit('Form: valid data', { firstYearSavings: first_year_savings });

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

    vm.prospect().percentSolar = percent_solar;
    Form.ref() && Client.emit('Form: valid data', { percentSolar: percent_solar });

    // calculate percentage of energy not coming from solar
    percent_utility = 100 - percent_solar;
    vm.prospect().percentUtility = percent_utility;
    Form.ref() && Client.emit('Form: valid data', { percentUtility: percent_utility });
    drawPowerChart();

    // create the sharelink
    Session.rx_session().then(function (rx_s) {
      share_map_center.lat = rx_s.value.map_center.lat
      share_map_center.lng = rx_s.value.map_center.lng
      share_link = [$location.protocol() ,
      "://",      URL_ROOT ,
      "#/share/", Session.id(),
      "/",        bill,
      "/",        utility_rate,
      "/",        scty_rate,
      "/",        average_yield,
      "/",        share_map_center.lat,
      "/",        share_map_center.lng].join('');
      vm.prospect().share_link = share_link;

      Form.ref() && Client.emit('Form: valid data', {proposal_share_link: share_link});
    });
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
        color: '#17c188',
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
