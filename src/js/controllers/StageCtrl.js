// controllers.controller("StageCtrl", ["$scope", "$state", "StageService", "InteractionService", "LayerService", "SyncService", "JwtService", "syncData", StageCtrl_]);
controllers.controller("StageCtrl", ["$scope", "$state", "$timeout", "TemplateConfig", "SyncService", "Session", "StreamService", StageCtrl_]);

function StageCtrl_($scope, $state, $timeout, Templates, Sync, Session, Stream) {

  var vm = this;
  /* ================================

  This controller keeps the view in sync with the Stage object on Firebase and exposes controls to let you change the Stage on firebase

  "next" & "prev" - step forward or backward in the flow.
  ================================ */

  // get Session info
  var session_ref,
      session_stream,
      new_session,
      stage,
      step,
      stage_stream,
      step_stream;

  session_ref = Session.ref()
  session_stream = Session.stream()

  // HACK: setup
  stage = 0;
  step  = 0;

  // for dev: //////////////////////////////
  new_session = true;
  /* jshint +W030 */
  new_session && session_ref.update({
                   stage: stage,
                   step:  step,
                 });
  /* jshint -W030 */
  // end dev: //////////////////////////////

  // and partials
  vm.partial = Templates.partial(stage,step);
  // view_sync helps flow control for async // TODO: more stream-like
  $scope.view_sync = true;

  // now streams ////////
  stage_stream = new Stream();
  stage_stream.listen('stage', function stage_listen (target_state) {
    stage = target_state.stage;
    var name = Templates.config[stage].name
    $state.go(name).then(function(){
      step_stream.emit('step', target_state.step)
    });
  });

  step_stream = new Stream();
  step_stream.listen('step', function stage_listen (target_step) {
    step = target_step;
    $timeout(function(){
      vm.partial = Templates.partials[stage][step];
      $scope.$apply();
      session_ref.update({
        stage: stage,
        step:  step
      })
      $scope.view_sync = true;
    }, 1)
  });

  session_stream = Session.stream()
  .map(function(x){
    return x.val() || x;
  })
  .subscribe(function handle_session_stream (data) {
    if ($scope.view_sync) {
      if (data.stage !== stage) {
        stage_stream.emit('stage', data);
        $scope.view_sync = false;
      } else if (data.step !== step) {
        step_stream.emit('step', data.step);
        $scope.view_sync = false;
      }
    }
  });

  // user flow controls
  vm.next = function(){
    if ( step + 1 < Templates.config[stage].steps.length ) {
      step_stream.emit('step', step + 1);
    } else if (stage + 1 < Templates.config.length ) {
      stage_stream.emit('stage', {
        stage: stage + 1,
        step:  0,
      })
    }
  };

  vm.prev = function(){
    if ( step - 1 >= 0 ) {
      step_stream.emit('step', step - 1);
    } else if (stage - 1 >= 0 ) {
      stage_stream.emit('stage', {
        stage: stage - 1,
        step:  Templates.config[stage - 1].steps.length -1,
      })
    }
  };
}
