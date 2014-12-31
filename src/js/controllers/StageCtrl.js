controllers.controller("StageCtrl", ["$scope", "$state", "$timeout", "TemplateConfig", "Session", "Clientstream", StageCtrl_]);
function StageCtrl_($scope, $state, $timeout, Templates, Session, Clientstream) {

  var vm = this;
  /* ================================

  This controller keeps the view in sync with the Session object on Firebase and exposes controls to change the "stage" & "step"

  use "next" & "prev" - step forward or backward in the flow.

  ================================ */

  // get Session info
  var session_ref = Session.ref();

  var stage = 0;
  var step  = 0;

  // for dev: //////////////////////////////

  var state_ref =  session_ref.child('state')
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
        Clientstream.emit('stage', data);
      } else if (data.step !== step) {
        Clientstream.emit('step', data.step);
      }
    }
  });

  // listen for change requests
  // stage listen
  Clientstream.listen('stage', function stage_listen (target_state) {
    target_state = !!target_state.state ? target_state.state : target_state;
    if ($scope.view_sync) {
      stage = target_state.stage;
      var name = Templates.config[stage].name
      $state.go(name).then(function(){
        // trigger step changes afterwards
        Clientstream.emit('step', target_state.step)
      });
    }
  });
  // step listen
  Clientstream.listen('step', function step_listen (target_step) {
    step = target_step;
    $timeout( function () {
      // unlock the view
      $scope.view_sync = true;
      $scope.$apply();
    }, 1);
    // update the view
    vm.partial = Templates.partials[stage][step];
    // update firebase
    /* jshint -W030 */
    $scope.view_sync && state_ref.update({
      stage: stage,
      step: step
    });
    /* jshint +W030 */
  });

  // user flow controls
  vm.next = function(){
    if ( step + 1 < Templates.config[stage].steps.length ) {
      Clientstream.emit('step', step + 1);
    } else if (stage + 1 < Templates.config.length ) {
      Clientstream.emit('stage', {
        stage: stage + 1,
        step:  0,
      })
    }
  };

  vm.prev = function(){
    if ( step - 1 >= 0 ) {
      Clientstream.emit('step', step - 1);
    } else if (stage - 1 >= 0 ) {
      Clientstream.emit('stage', {
        stage: stage - 1,
        step:  Templates.config[stage - 1].steps.length -1,
      })
    }
  };

}
