// <<<<<<< HEAD
// <<<<<<< Updated upstream
// function StageService_ ($state) {
// =======
function StageService_ ($state, FBURL, StreamService, TemplateConfig) {
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

  var stream = StreamService; // ease of use

  var stage_stream, // stage events
      step_stream,  //
      state_stream;

  var StageService = {};

// <<<<<<< HEAD
// <<<<<<< Updated upstream
//   // FIREBASE THESE //
//   var _current = {
//     stage: 0,
//     step:  0,
//     history: _history,
//   };

// =======
  var _history = []; // TODO: state objects go here
// >>>>>>> Stashed changes
// =======
  var config_object = TemplateConfig.config;  // TODO: this shouldn't be here
  StageService.config = config_object;

  // FIREBASE THESE //
  var _current = {
    stage: 0,
    step:  0,
    history: _history,
  };

  // var client_step = new stream()
  // var client_observer = client_step.listen('newstate',function handle_client_up (data) {
  //   console.log('handle client next, data: ', data);
  //   console.log('arguments in client next listener', arguments);
  // });

  // var server_step = new stream()
  // server_step.listen('s_stp_up', function handle_server_up (data) {
  //   console.log('handle server step up, data: ', data);
  // });

  // server_step.emit('s_stp_up', {newstage: "1****************************************"})


  // var client_stage = new stream().listen('c_stg_up',function handle_client_up (data) {
  //   console.log('handle client stage up, data: ', data);
  // });

  // var __design_stream = rx_ref.map(function(e){
  //   return e.val();
  // });

  // __design_stream.subscribe(function function_name (e) {
  //   console.log('updating state from fb change')
  //   console.log('previous current', _current)
  //   _current = e.state;
  //   console.log('new current', _current)
  // })

  // var fb_stage_stream = __design_stream.filter(function stage_filter (e) {
  //   console.log('stage_filter _current')
  //   console.log('previous current', _current)
  //   _current = e.state;
  //   console.log('new current', _current)
  //   return e.state.stage;
  // })

  // var fb_step_stream = __design_stream.filter(function step_filter (e) {
  //   console.log('step_filter _current')
  //   console.log(_current.step)
  //   return e.state.step;
  // })

  // END FIREBASED OBJECTS //

  var _history = []; // TODO: state objects go here
// >>>>>>> feature/firebase_rx
//   function curr_step(){
//     return _current.step;
//   }
//   function curr_stage(){
//     return _current.stage;
//   }

//   function next() {
//     // TODO: addHistory()
//     var step = curr_step();
//     var last = config_object[curr_stage()].steps.length - 1;
//     if ( step < last ) {
//       // bump the steps up
//       return _current.step++;
//     // or if you're at the last step
//     } else if ( step === last ) {
//       // do the stageUp function
//       client_step.emit('newstate', {step: 0, stage: "butts" })
//       return stageUp();
//     }
//   }

//   function prev() {
//     // TODO: addHistory()
//     var step = curr_step();
//     // go down a step or back to prev stage
//     if (step > 0) {
//       return _current.step--;
//     } else if ( step === 0 ) {
//       return stageDown();
//     }
//   }

//   function destination(stage_id) {
//     return config_object[stage_id].destination;
//   }

//   function stageUp() {
//     // TODO: history()
//     var stage = curr_stage();
//     var stages = config_object.length - 1;
//     if ( stage < stages ) {
//       _current.step = 0;
//       _current.stage++;
//       return $state.go(destination(stage));
//     } else {
//       alert('no more stages');
//       return stage;
//     }
//   }

//   function stageDown() {
//     // TODO: history()
//     // NOTE: this doesn't work
//     alert('stageDown doesn\'t work yet');
//     var stage = curr_stage();
//     if (stage > 0 ) {
//       _current.step = config_object[curr_stage() - 1].steps.length - 1;
//       _current.stage--;
//       return $state.go(destination(stage-1));
//     } else {
//       alert('first stage');
//       return stage;
//     }
//   }

//   var _partials = TemplateConfig.partials;  //TODO: this prob shouldn't be here
//   StageService.partials = _partials;

//   StageService.syncObj = function() {
//     console.log('syncobj')
//     return {
//       partials: _partials,
//       stage: _current.stage,
//       step:  _current.step,
//       // _step_stream:  _current._step_stream,
//       // _stage_stream: _current._stage_stream,
//       next: next,
//       prev: prev,
//     };
//   };

  // StageService.state_stream = __design_stream;
  return StageService;
}

angular.module('flannel').service('StageService', StageService_);
