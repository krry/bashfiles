function StageService_ ($state, rx_ref, FBURL) {
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

  // FIREBASE THESE //
  var _current = {
    stage: 0,
    step:  0,
    history: _history,
  };

  var __design_stream = rx_ref.map(function(e){
    return e.val();
  });

  __design_stream.subscribe(function function_name (e) {
    console.log('updating state from fb change')
    console.log('previous current', _current)
    _current = e.state;
    console.log('new current', _current)
  })

  var fb_stage_stream = __design_stream.filter(function stage_filter (e) {
    console.log('stage_filter _current')
    console.log(_current.stage)
    return e.state.stage;
  })

  var fb_step_stream = __design_stream.filter(function step_filter (e) {
    console.log('step_filter _current')
    console.log(_current.step)
    return e.state.step;
  })

  // var _stage_stream = StageService.stage_stream.subscribe(stage_handler);
  // var _step_stream  = StageService.step_stream.subscribe(step_handler);

  var client_stage_stream = Rx.Observable.create(
    0,
    function (x) { return x < 3; },
    function (x) { return x + 1; },
    function (x) { return x; }
  );
  var client_step_stream = Rx.Observable.create(
    0,
    function (x) { return x < 3; },
    function (x) { return x + 1; },
    function (x) { return x; }
  );

  var stage_merge_stream = client_stage_stream.merge(fb_stage_stream);
  var step_merge_stream = client_step_stream.merge(fb_step_stream);


  var stage_subscription = stage_merge_stream.subscribe(
      function (x) {
        console.log('************* Next stage: ' + x);
      },
      function (err) {
        console.log('Error: ' + err);
      },
      function () {
        console.log('Completed');
      });

  var step_subscription = step_merge_stream.subscribe(
      function (x) {
        console.log('************* Next step: ' + x);
      },
      function (err) {
        console.log('Error: ' + err);
      },
      function () {
        console.log('Completed');
      });

  function stage_handler (e){
    console.log('stage', e.state.stage, "current", _current.stage)
    _current.stage = e.state.stage;
    // syncWithService()
  }

  function step_handler (e) {
    console.log('step', e.state.step, "current", _current.step)
    _current.step = e.state.step;
    // syncWithService()
  }

  StageService.config = config_object;
  var _history = []; // TODO: state objects go here

  // END FIREBASED OBJECTS //

  function curr_step(){
    return _current.step;
  }
  function curr_stage(){
    return _current.stage;
  }

  function partial_constructor (config) {
    var partials = [];
    // TODO: make this an injectable angular constant
    var template = 'templates/stages/';
    var name;
    function hardcode(part) {
      return template + name + '/' + part;
    }
    for (var i = 0; i < config.length; i++) {
      partials.push([]);
      name = config[i].name;
      for (var j = 0; j< config[i].steps.length; j++) {
        stage = partials[i];
        stage.push(hardcode(config[i].steps[j].partial))
      };
    }
    console.log('partials: ',partials)
    return partials;
  }

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

  var _partials = partial_constructor(config_object);
  StageService.partials = _partials;

  StageService.syncObj = function() {
    console.log('syncobj')
    return {
      partials: _partials,
      stage: _current.stage,
      step:  _current.step,
      _step_stream:  _current._step_stream,
      _stage_stream: _current._stage_stream,
      next: next,
      prev: prev,
    };
  };

  StageService.state_stream = __design_stream;
  return StageService;
}

angular.module('flannel').factory('StageService', StageService_);
