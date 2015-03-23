/* ==================================================

  TemplateConfig

  The order and organization of template partials
  consumed by StageCtrl

================================================== */

angular.module('flannel').factory('TemplateConfig', TemplateConfig_);

function TemplateConfig_ () {

  var config,
      partials,
      service;

  config = [
    {
      name: 'flannel.home',
      destination: 'flannel.configure',
      steps: [
        {
          staticLayout: true,
          step: 'zip-nearme',
          partial: 'zip.html'
        },
        {
          staticLayout: false,
          step: 'address-roof',
          partial: 'address.html'
        },
        {
          staticLayout: false,
          step: 'monthly-bill',
          partial: 'bill.html'
        },
        {
          staticLayout: true,
          step: 'intro-design',
          partial: 'fork.html'
        },
      ],
    },
    {
      name: 'flannel.configure',
      destination: 'flannel.proposal',
      steps: [
        {
          staticLayout: false,
          step: 'zoom-lock-roof',
          partial: 'zoom.html'
        },
        {
          staticLayout: false,
          step: 'trace-area',
          partial: 'trace.html'
        },
        {
          staticLayout: false,
          step: 'edit-area',
          partial: 'edit.html'
        },
        {
          staticLayout: false,
          step: 'detail-area',
          partial: 'detail.html'
        },
      ],
    },
    {
      name: 'flannel.proposal',
      destination: 'flannel.signup',
      steps: [
        {
          staticLayout: true,
          step: 'review-proposal',
          partial: 'proposal.html'
        },
      ],
    },
    {
      name: 'flannel.signup',
      destination: '',
      steps: [
        {
          staticLayout: true,
          step: 'create-contact',
          partial: 'contact.html'
        },
        {
          staticLayout: true,
          step: 'credit-check',
          partial: 'credit.html'
        },
        {
          staticLayout: true,
          step: 'qualify',
          partial: 'qualify.html'
        },
        {
          staticLayout: true,
          step: 'survey-calendar',
          partial: 'calendar.html'
        },
        {
          staticLayout: true,
          step: 'schedule-survey',
          partial: 'schedule.html'
        },
        {
          staticLayout: true,
          step: 'survey-questions',
          partial: 'questions.html'
        },
        {
          staticLayout: true,
          step: 'congrats',
          partial: 'congrats.html'
        },
      ],
    },
  ];

  partials = partial_constructor(config);

  service = {
    partials: partials,
    partial: partial,
    config: config,
  };

  function partial_constructor (config) {
    var stage,
        name,
        template = 'templates/stages/',
        partials = [];

    // TODO: make this an injectable angular constant
    function hardcode(part) {
      return template + name + '/' + part;
    }

    for (var i = 0; i < config.length; i++) {
      partials.push([]);
      name = config[i].name.split('.')[1]; // drop the "flannel." part of the state's name.
      for (var j = 0; j< config[i].steps.length; j++) {
        stage = partials[i];
        stage.push(hardcode(config[i].steps[j].partial));
      }
    }
    return partials;
  }


  function partial (stg, stp) {
    return partials[stg][stp];
  }

  return service;
}