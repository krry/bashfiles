controllers.controller("StageCtrl", ["$scope", "$state", "TemplateConfig", "SyncService", "Session", StageCtrl_]);

function StageCtrl_($scope, $state, Templates, Sync, Session) {
  var vm = this;
  /* ================================

  This controller keeps the view in sync with the Stage object on Firebase and exposes controls to let you change the Stage on firebase

  "next" & "prev" - step forward or backward in the flow.

  ================================ */

  // setup initial values
  // for step and stage:
  var stage = 0;
  var step  = 0;
  // and partials
  vm.partial = Templates.partials[stage][step];

  var session_ref = Sync.get('session_ref');

  $scope.view_sync = true;

  var session_stream = Session
  .map(function(x){
    return x.val() || x;
  })
  .subscribe(function handle_session_stream (data) {
    if (data.stage !== stage) {
      $scope.view_sync = false;
      // update the stage on the client
      stage = data.stage;
      step  = data.step;
      // go to new state
      updatePartials(stage, step);
      $state.go(Templates.config[stage].name)
    } else if (data.step > step) {
      step = data.step;
      vm.next();
    } else if (data.step < step) {
      step = data.step;
      vm.prev();
    }
    updatePartials(stage, step);
  });

  function updatePartials (stg, stp) {
    stp = stp || step;
    vm.partial = Templates.partials[stg][stp];
    // !$scope.view_sync && $scope.$apply();
    $scope.view_sync = true;
  }

  // user flow controls
  vm.next = function(){
    var end = (step === Templates.config[stage].steps.length);
    $scope.view_sync = false;
    console.log('step', step, 'length', Templates.config[stage].steps.length, {
      stage: end ? stage+1 : stage,
      step:  end ? 0 : step + 1,
    });
    session_ref.update({
      stage: end ? stage++ : stage,
      step:  end ? 0 : step++,
    })
  };

  vm.prev = function(){
    $scope.view_sync = false;
    console.log('step', step, 'length', Templates.config[stage].steps.length);
    session_ref.update({
      stage: step < 0 ? stage-- : stage,
      step:  step < 0 ? Templates.config[stage].steps.length - 1 : step--,
    })
  };
}
