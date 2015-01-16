/* ==================================================
  
  StageCtrl

  keeps the view in sync with the Session object on 
  Firebase

  exposes controls to change the "stage" & "step"
  exposes the partials object and the current partial

  use `StageCtrl.next()` & `StageCtrl.prev()` to
  step forward or backward in the flow.

================================================== */

controllers.controller("StageCtrl", ["$scope", "$state", "$timeout", "TemplateConfig", "Session", "Clientstream", StageCtrl_]);

function StageCtrl_($scope, $state, $timeout, Templates, Session, Clientstream) {

  var vm,
      session_ref,
      stage,
      step,
      state_ref,
      session_stream;

  // get Session info
  session_ref = Session.ref();
  stage = 0;
  step  = 0;

  vm = this;
  vm.next = next;
  vm.prev = prev;
  vm.jumpToStage = jumpToStage;
  vm.startOver = startOver;
  vm.partial = Templates.partial(stage, step);
  vm.partials = flattenPartialsArray(Templates.partials);

  function flattenPartialsArray (array) {
    var partials = [];
    var array_length = array.length;
    var this_partial;
    for (var i = 0; i < array_length; i++) {
      for (var j = 0; j < array_length; j++) {
        this_partial = array[i][j];
        if (typeof this_partial !== "undefined") {
          partials.push(this_partial);
        }
      }
    }
    // console.log(partials);
    return partials;
  }

  // for dev: //////////////////////////////
  state_ref =  session_ref.child('state')
  state_ref.set({
    stage: stage,
    step:  step,
  })

  // $timeout(function(){
  //   Clientstream.emit('stage', {
  //       stage: 1,
  //       step:  0,
  //     })
  // }, 200)

  // view_sync helps flow control for async // TODO: more stream-like
  $scope.view_sync = true;

  // now a stream from firebase
  session_stream = Session.stream()
    .map(function(x){
      return x.val() || x;
    })
    .subscribe(function handle_session_stream (data) {
      if ($scope.view_sync) {
        // lock the view if you're making changes
        $scope.view_sync = false;
        if (data.stage !== stage) {
          Clientstream.emit('stage', data);
        } else if (data.step !== step) {
          Clientstream.emit('step', data.step);
        }
      }
    });

  // register listeners for stage, step, and start over events

  // stage listener
  Clientstream.listen('stage', function stage_listen (target_state) {
    var name;
    if (target_state === "next") {
      next();
    } else if (target_state === "back") {
      back();
    } else if ($scope.view_sync) {
      target_state = !!target_state.state ? target_state.state : target_state;
        stage = target_state.stage;
        name = Templates.config[stage].name;
        $state.go(name).then(function(){
          // trigger step changes afterwards
          Clientstream.emit('step', target_state.step)
        });

    }
  });

  // step listener
  Clientstream.listen('step', function step_listen (target_step) {
    step = target_step;
    $timeout( function () {
      // unlock the view
      $scope.view_sync = true;
      $scope.$apply();
    }, 1);
    // update the view
    // vm.partial = Templates.partials[stage][step];
    vm.partial = Templates.partial(stage, step);
    // update firebase
    /* jshint -W030 */
    $scope.view_sync && state_ref.update({
      stage: stage,
      step: step
    });
    /* jshint +W030 */
  });

  // start over listener
  Clientstream.listen('start over', function start_over (data) {
    console.log('heard that startover', data)
    Clientstream.emit('erase area', data);
    /* jshint -W030 */
    $scope.view_sync && Clientstream.emit('stage', {
      stage: 1,
      step: 0
    });
    /* jshint +W030 */
  });

  function startOver () {
    Clientstream.emit('start over', 'butts');
  }

  function jumpToStage (stage) {
    console.log('trying to jump to:', stage, 'stage');
    var stages = Templates.config;
    for (var i = 0; i < stages.length; i++) {
      if (stage === Templates.config[i].name) {
        Clientstream.emit('stage', {
          stage: i,
          step: 0
        });
      }
    }
  }

  // user flow controls
  function next (){
    if ( step + 1 < Templates.config[stage].steps.length ) {
      Clientstream.emit('step', step + 1);
    } else if (stage + 1 < Templates.config.length ) {
      Clientstream.emit('stage', {
        stage: stage + 1,
        step:  0,
      })
    }
  }

  function prev (){
    if ( step - 1 >= 0 ) {
      Clientstream.emit('step', step - 1);
    } else if (stage - 1 >= 0 ) {
      Clientstream.emit('stage', {
        stage: stage - 1,
        step:  Templates.config[stage - 1].steps.length -1,
      })
    }
  }
}
