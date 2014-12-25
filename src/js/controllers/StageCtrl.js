// controllers.controller("StageCtrl", ["$scope", "$state", "StageService", "InteractionService", "LayerService", "SyncService", "JwtService", "syncData", StageCtrl_]);
controllers.controller("StageCtrl", ["$scope", "$state", "$timeout", "TemplateConfig", "Session", "StreamService", StageCtrl_]);

function StageCtrl_($scope, $state, $timeout, Templates, Session, Stream) {

  var vm = this;
  /* ================================

  This controller keeps the view in sync with the Stage object on Firebase and exposes controls to let you change the Stage on firebase

  "next" & "prev" - step forward or backward in the flow.
  ================================ */

  // get Session info
  var session_ref = Session.ref()

  // HACK: setup
  var stage = 0;
  var step  = 0;

  // for dev: //////////////////////////////
  var new_session = true;
  new_session && session_ref.update({
                   stage: stage,
                   step:  step,
                 });
  $timeout(function() {
      state_stream.emit('step',{
                   stage: 0,
                   step:  Templates.config[stage].steps.length -1,
                 });
  }, 200);
  $timeout(function() {
    vm.next();
  }, 500);
  // end dev: //////////////////////////////

  // and partials
  vm.partial = Templates.partial(stage,step);

  // view_sync helps flow control for async // TODO: more stream-like
  $scope.view_sync = true;

  // now a stream from firebase
  var session_stream = Session.stream()
  .map(function(x){
    return x.val() || x;
  })
  .subscribe(function handle_session_stream (data) {
    if ($scope.view_sync) {
      // lock the view if you're making changes
      $scope.view_sync = false;
      if (data.stage !== stage) {
        state_stream.emit('stage', data);
      } else if (data.step !== step) {
        state_stream.emit('step', data.step);
      }
    }
  });

  // and a stream from the client
  var state_stream = new Stream();
  // listen for stage changes
  state_stream.listen('stage', function stage_listen (target_state) {
    stage = target_state.stage;
    var name = Templates.config[stage].name
    $state.go(name).then(function(){
      // trigger step changes afterwards
      state_stream.emit('step', target_state.step)
    });
  });
  // listen for step changes
  state_stream.listen('step', function step_listen (target_step) {
    step = target_step;
    $timeout(function(){
      // update the view
      vm.partial = Templates.partials[stage][step];
      $scope.$apply();
      // update firebase
      session_ref.update({
        stage: stage,
        step:  step
      })
      // unlock the view
      $scope.view_sync = true;
    }, 1)
  });


  // user flow controls
  vm.next = function(){
    if ( step + 1 < Templates.config[stage].steps.length ) {
      state_stream.emit('step', step + 1);
    } else if (stage + 1 < Templates.config.length ) {
      state_stream.emit('stage', {
        stage: stage + 1,
        step:  0,
      })
    }
  };

  vm.prev = function(){
    if ( step - 1 >= 0 ) {
      state_stream.emit('step', step - 1);
    } else if (stage - 1 >= 0 ) {
      state_stream.emit('stage', {
        stage: stage - 1,
        step:  Templates.config[stage - 1].steps.length -1,
      })
    }
  };

}
