angular.module('flannel').factory('TemplateConfig', TemplateConfig_);
function TemplateConfig_ () {
  /* ================================
    TemplateConfig

    The order and organization of template partials used by StageService

  ================================ */

  var config = [
    {
      name: 'home',
      destination: 'configure',
      steps: [
        { step: 'zip-nearme',   partial: 'zip.html'         },
        { step: 'address-roof', partial: 'address.html'     },
        { step: 'address-roof', partial: 'address.html'     },
      ],
    },
    // {
    //   name: 'home',
    //   destination: 'configure',
    //   steps: [
    //     { step: 'zip-nearme',   partial: 'zip.html'         },
    //     { step: 'address-roof', partial: 'address.html'     },
    //   ],
    // },
    {
      name: 'configure',
      destination: 'signup',
      steps: [
        { step: 'zoom-lock-roof', partial: 'zoom.html'     },
        { step: 'trace-area',     partial: 'trace.html'    },
        { step: 'edit-area',      partial: 'edit.html'     },
        { step: 'detail-area',    partial: 'detail.html'   },
        { step: 'area-slope',     partial: 'slope.html'    },
        { step: 'complete-area',  partial: 'complete.html' },
      ],
    },
    {
      name: 'signup',
      destination: '',
      steps: [
        { step: 'credit-check',    partial: 'credit.html'   },
        { step: 'review-proposal', partial: 'proposal.html' },
        { step: 'schedule-survey', partial: 'schedule.html' },
        { step: 'congrats',        partial: 'congrats.html' },
      ],
    },
  ];

  var partials = partial_constructor(config);

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
        stage.push(hardcode(config[i].steps[j].partial))
      }
    }
    console.log('partials: ', partials);
    return partials;
  }


  function partial (stg, stp) {
    return partials[stg][stp];
  }

  return {
    partials: partials,
    partial: partial,
    config: config,
  }
}

