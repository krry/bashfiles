/* ==================================================

  StageCtrl

  keeps the view in sync with the Session object on
  Firebase

  exposes controls to change the "stage" & "step"
  exposes the partials object and the current partial

  use `StageCtrl.next()` & `StageCtrl.prev()` to
  step forward or backward in the flow.

================================================== */

controllers.controller("StageCtrl", ["$scope", "$location", "$state", "$timeout", "User", "TemplateConfig", "Session", "Clientstream", "ModalService", StageCtrl_]);

function StageCtrl_($scope, $location, $state, $timeout, User, Templates, Session, Client, Modal) {
  var vm,
      session_ref,
      stage,
      step,
      state_ref,
      session_stream,
      waiting,
      help_steps,
      unlockODA,
      latestStage,
      latestStep,
      hasLoaded;

  stage = 0;
  step  = 0;
  latestStage = 0;
  latestStep = 0;
  waiting = false;
  unlockODA = false;
  hasLoaded = false;

  vm = this;
  vm.next = next;
  vm.prev = prev;
  vm.waiting = isWaiting;
  vm.startOver = startOver;
  vm.jumpToStep = jumpToStep;
  vm.jumpToStage = jumpToStage;
  vm.checkAndJump = checkAndJump;
  vm.spinIt = waiting;
  vm.partial = Templates.partial(stage, step);
  vm.partials = flattenPartialsArray(Templates.partials);
  vm.states = Templates.states;
  vm.currentStep = currentStep;

  // determines whether view layout is fixed or static
  vm.fixed = !Templates.config[stage].steps[step].staticLayout;

  // determines whether the help/chat popup is visible or not
  vm.helpActivated = false;
  help_steps = [
    'intro-design',
    'zoom-lock-roof',
    'trace-area',
    'edit-area',
    'detail-area',
    'review-proposal',
    'create-contact',
    'credit-check',
    'qualify',
    'survey-calendar',
    'schedule-survey',
    'congrats'
  ];

  // subscribe to the state when session is loaded
  Client.listen('Session: Loaded', bootstrapNewSession);
  Client.listen('Modal: continue design? result', popContinueModal); // result of modal button press

  // register listeners for stage, step, and start over events
  Client.listen('Stages: jump to step', jumpToStep);
  Client.listen('Stages: jump to stage', jumpToStage);
  Client.listen('Stages: stage', stageListen);
  Client.listen('Stages: step', stepListen);
  Client.listen('Router: state change success', stepFinish);
  Client.listen('start over', startOver);
  Client.listen('Spinner: spin it', setWaiting);
  Client.listen('Stages: stage', stageLayout);
  Client.listen('ODA: Request session', unlockODAState);

  function currentStep (step) {
    return step === step;
  }

  function stageLayout (target_state) {
    if (typeof target_state === "string" ) return;
    var stage = target_state.stage;
    // console.log("Templates.config[stage].name", Templates.config[stage].name);
    if (Templates.config[stage].name === 'flannel.proposal') {
      vm.proposal = true;
    }
  }
  // view_sync helps flow control for async // TODO: more stream-like
  $scope.view_sync = true;

  function bootstrapNewSession (session_data) {
    var hasAdvanced = !User.isNew,
        zipParam = getParameterByName('zip'),
        isOnHome = $state.is('flannel.home.zip-nearme') || $state.is('flannel.home.address-roof');

    // bootstrap a new session, start it's streams up
    session_stream = Session.state_stream()
      .filter(function() { return $scope.view_sync; }) // don't listen to changes you're making
      .select(function(x){ return x.exportVal();    }) // just watch the value of the state
      .subscribe(streamSubscription);
    // anounce you're watching the streams, send the new data
    Client.emit('Stages: subscribed to statestream', session_data);

    latestStage = session_data.state.latestStage || 0;
    latestStep = session_data.state.latestStep || 0;
    hasLoaded = true;

    // Only show the continue modal if the user is on the home page (zip or address page) and has advanced in the flow
    // Else, on other pages, we let that page's url take precedence
    if (!isOnHome && !hasAdvanced) {
      Client.emit('Stages: jump to step', 'zip-nearme');
    }
    else if (isOnHome && hasAdvanced) {
      Modal.set(true);
      return Modal.activate('continue');
    }
    // Advance to the address page if there is a zip parameter and the user hasn't advanced in the flow before
    else if (zipParam && !hasAdvanced) {
      $state.go('flannel.home.address-roof').then(function() {
        Client.emit('check zip', zipParam);
      });
    }
  }

  function streamSubscription (data) {
    if (data === null) return; // will be null if there's no value to the firebase object, which shouldn't happen
    // you're about to emit messages that making changes to the templates. Lock the view so that
    // messages don't arrive in the meantime.
    // $scope.view_sync = false; // TODO: why isn't this necessary anymore?

    // Don't let session object overtake the app on share proposal and design link states
    if ($state.is('share_proposal') || ($state.is('design_link') && !unlockODA)) return;

    if (data.stage !== stage) {
      console.log('data.stage', data.stage,'diff from client stage', stage);
      Client.emit('Stages: stage', data);
    }
    else if (data.step !== step) {
      console.log('same stage, but data.step', data.step, 'diff from client step', step, $scope.view_sync);
      Client.emit('Stages: step', data.step);
    }
  }

  function isWaiting () {
    return waiting;
  }

  function setWaiting (data) {
    waiting = data;

    console.log('adding to spin count', data);
    Client.emit('Spinner: add to spin count', data);

    $timeout(function(){
      $scope.$apply();
    }, 0);
  }

  // listen for stage change requests from ui-router
  function startOver (data) {
    console.log('heard that startover', data);

    Client.emit('erase area', data);

    $scope.view_sync && Client.emit('Stages: stage', {
      stage: 1,
      step: 0
    });
  }

  function popContinueModal (result) {
    // close the modal
    Modal.set(false);
    if (result === 'restart') {
      return Client.emit('Stages: restart session', true);
    } else if (result === 'resume') {
      // load all the form data?
      // do nothing?
      return;
    }
  }

  function stageListen (target_state) {
    // console.log('heard that stage emission', target_state, 'view_sync',$scope.view_sync);
    var name;
    if (target_state === "next") {
      next();
    } else if (target_state === "back") {
      prev();
    } else if ($scope.view_sync) {
      target_state = !!target_state.state ? target_state.state : target_state;
      stage = target_state.stage;
      step = target_state.step;
      name = Templates.config[stage].name;
      $state.go(Templates.config[stage].name + '.' + Templates.config[stage].steps[step].step).then(function(){
        vm.fixed = !Templates.config[stage].steps[step].staticLayout;
        // trigger step changes afterwards
        // Client.emit('Stages: step', target_state.step)
      });
    }
  }

  function stepFinish(opts) {
    stage = opts.stage;
    step = opts.step;

    // Only overwrite latestStage and latestStep if they incremented
    if (stage > latestStage) {
      latestStage = stage;
      latestStep = step;
    }
    else if (stage === latestStage && step > latestStep) {
      latestStep = step;
    }

    $timeout( function () {
      // unlock the view
      $scope.view_sync = true;
      $scope.$apply();
    }, 1);

    vm.fixed = !Templates.config[stage].steps[step].staticLayout;

    // update firebase
    // Don't update the ref until we load the current ref
    if ($scope.view_sync && hasLoaded) {
      Session.ref().child('state').update({
        stage: stage,
        step: step,
        latestStage: latestStage,
        latestStep: latestStep
      });
    }

    // once the user advances to the fork step, show the help/chat popup
    if (help_steps.indexOf(Templates.config[stage].steps[step].step) > -1) {
      vm.helpActivated = true;
    }
    Client.emit('Stages: step complete', Templates.config[stage].steps[step].step);
    console.log('location.path is:', $location.$$path);
  }

  function stepListen (target_step) {
    // console.log('heard that step emission', target_step);
    step = target_step;

    // update the view
    $state.go(Templates.config[stage].name + '.' + Templates.config[stage].steps[step].step).then(function() {
      vm.fixed = !Templates.config[stage].steps[step].staticLayout;
      // stepFinish({ stage: stage, step: step });
    });
  }

  // user flow controls
  function next () {
    if ( step + 1 < Templates.config[stage].steps.length ) {
      Client.emit('Stages: step', step + 1);
    } else if (stage + 1 < Templates.config.length ) {
      Client.emit('Stages: stage', {
        stage: stage + 1,
        step:  0,
      })
    }
  }

  function prev () {
    if ( step - 1 >= 0 ) {
      Client.emit('Stages: step', step - 1);
    } else if (stage - 1 >= 0 ) {
      Client.emit('Stages: stage', {
        stage: stage - 1,
        step:  Templates.config[stage - 1].steps.length -1,
      })
    }
  }

  // Checks if user has gone to the specified state previously, and if so, jumps to that state
  function checkAndJump(target) {
    var states = $state.get(),
        targetState;

    states.forEach(function(state) {
      if (state.name === target) {
        targetState = state;
      }
    });

    if (latestStage > targetState.stage || (latestStage === targetState.stage && latestStep > targetState.step)) {
      stage = targetState.stage;
      stepListen(targetState.step);
    }
  }

  function jumpToStep (target) {
    console.log('trying to jump to:', target, 'step');
    var steps = Templates.config[stage].steps;
    for (var i = 0; i < steps.length; i++) {
      if ( target === steps[i].step ) {
        Client.emit('Stages: step', i);
      }
    }
  }

  function jumpToStage (target) {
    // console.log('trying to jump to:', target, 'stage');
    var stages = Templates.config;
    for (var i = 0; i < stages.length; i++) {
      if ( target !== i && target === Templates.config[i].name) {
        Client.emit('Stages: stage', {
          stage: i,
          step: 0
        });
      }
    }
  }

  function flattenPartialsArray (array) {
    var partials,
        stages_count,
        steps_count,
        this_partial;

    partials = [];
    stages_count = array.length;

    for (var i = 0; i < stages_count; i++) {
      steps_count = array[i].length;
      for (var j = 0; j < steps_count; j++) {
        this_partial = array[i][j];
        if (typeof this_partial !== "undefined") {
          partials.push(this_partial);
        }
      }
    }

    return partials;
  }

  function getParameterByName(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(location.search);
    return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
  }

  function unlockODAState() {
    unlockODA = true;
  }
}
