function StageService_ ($state) {
  /* ================================
    StageService

    provides a SyncObject with the following methods:
      next() -- move forward in flow
      prev() -- move backward in flow

    structures the user flow, e.g.:
      * Stage 1
          * Step A
          * Step B
          * Step C
      * Stage 2
          * Step A
          * Step B
      etc...

    TODO:
      make a private history function that keeps a record of what you've done
      move config_object to $provider

    TODO: flesh out the stageCtrl, see `docs/stages+states.md`

  ================================ */

  var StageService = {};

  // FIREBASE THESE //
  var _current = {
    stage: 0,
    step:  0,
    history: _history,
  };

  function curr_step(){
    return _current.step;
  }
  function curr_stage(){
    return _current.stage;
  }

  var config_object = [
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
        { step: 'zoom-lock-roof', partial: 'zoom.html'   },
        { step: 'trace-area',     partial: 'trace.html'  },
        { step: 'edit-area',      partial: 'edit.html'   },
        { step: 'detail-area',    partial: 'detail.html' },
        { step: 'area-slope',     partial: 'slope.html' },
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
  StageService.config = config_object;
  var _history = []; // TODO: state objects go here

  // END FIREBASED OBJECTS //

  function next() {
    // TODO: addHistory()
    var step = curr_step();
    var last = config_object[curr_stage()].steps.length - 1;
    if ( step < last ) {
      // bump the steps up
      return _current.step++;
    // or if you're at the last step
    } else if ( step === last ) {
      // do the stageUp function
      return stageUp();
    }
  }

  function prev() {
    // TODO: addHistory()
    var step = curr_step();
    // go down a step or back to prev stage
    if (step > 0) {
      return _current.step--;
    } else if ( step === 0 ) {
      return stageDown();
    }
  }

  function destination(stage_id) {
    return config_object[stage_id].destination;
  }

  function stageUp() {
    // TODO: history()
    var stage = curr_stage();
    var stages = config_object.length - 1;
    if ( stage < stages ) {
      _current.step = 0;
      _current.stage++;
      return $state.go(destination(stage));
    } else {
      alert('no more stages');
      return stage;
    }
  }

  function stageDown() {
    // TODO: history()
    // NOTE: this doesn't work
    alert('stageDown doesn\'t work yet');
    var stage = curr_stage();
    if (stage > 0 ) {
      _current.step = config_object[curr_stage() - 1].steps.length - 1;
      _current.stage--;
      return $state.go(destination(stage-1));
    } else {
      alert('first stage');
      return stage;
    }
  }

  StageService.syncObj = function() {
    return {
      stage: _current.stage,
      step:  _current.step,
      next: next,
      prev: prev,
    };
  };

  return StageService;
}

angular.module('flannel').factory('StageService', StageService_);
