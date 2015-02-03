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
      name: 'home',
      destination: 'configure',
      steps: [
        { step: 'zip-nearme',      partial: 'zip.html'      },
        { step: 'address-roof',    partial: 'address.html'  },
        { step: 'monthly-bill',    partial: 'bill.html'     },
        { step: 'intro-design',    partial: 'design.html'   },
      ],
    },
    {
      name: 'configure',
      destination: 'signup',
      steps: [
        { step: 'zoom-lock-roof',  partial: 'zoom.html'     },
        { step: 'trace-area',      partial: 'trace.html'    },
        { step: 'edit-area',       partial: 'edit.html'     },
        { step: 'detail-area',     partial: 'detail.html'   },
        { step: 'area-slope',      partial: 'slope.html'    },
        { step: 'complete-area',   partial: 'complete.html' },
      ],
    },
    {
      name: 'signup',
      destination: '',
      steps: [
        { step: 'review-proposal', partial: 'proposal.html' },
        { step: 'credit-check',    partial: 'credit.html'   },
        { step: 'schedule-survey', partial: 'schedule.html' },
        { step: 'congrats',        partial: 'congrats.html' },
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
      name = config[i].name;
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

