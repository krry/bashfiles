function TemplateConfig_ () {
  /* ================================
    TemplateConfig

   The order and organization of template partials used by StageService

  ================================ */

  return [
    {
      name: 'home',
      destination: 'configure',
      steps: [
        {
          step: 'zip-nearme',
          partial: 'zip.html'
        },
        {
          step: 'address-roof',
          partial: 'address.html',
        }
      ],
    },
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
        // { step: 'schedule-survey', partial: 'schedule.html' },
        { step: 'congrats',   partial: 'congrats.html' },
      ],
    },
  ];

}

angular.module('flannel').factory('TemplateConfig', TemplateConfig_);
