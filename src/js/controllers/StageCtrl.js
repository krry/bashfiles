// <<<<<<< Updated upstream
// controllers.controller("StageCtrl", ["$scope", "$state", "StageService", "InteractionService", "LayerService", "SyncService", "JwtService", "syncData", StageCtrl_]);

// function StageCtrl_($scope, $state, StageService, InteractionService, LayerService, SyncService, JwtService, syncData) {
//   // This controller should be used for anything that needs to control which partials are being used
// =======
controllers.controller("StageCtrl", ["$scope", "$state", "$timeout","TemplateConfig", "SyncService", "Session", StageCtrl_]);

function StageCtrl_($scope, $state, $timeout, Templates, Sync, Session) {
// >>>>>>> Stashed changes
  var vm = this;
  var config = StageService.config;
  $scope.sync  = StageService.syncObj;

  // stage & step index numbers
  var stage = $scope.sync().stage;
  var step  = $scope.sync().step;

  // init
  JwtService.jwt();
  vm.partials = partials($scope.sync());
  vm.partial = vm.partials[0];

// <<<<<<< Updated upstream
//   function syncWithService() {
//     stage = $scope.sync().stage;
//     step  = $scope.sync().step;
//     vm.partials = partials($scope.sync());
//     vm.partial = vm.partials[step];
//   }

//   vm.next = function(){
//     $scope.sync().next();
//     syncWithService();
//   };
//   vm.prev = function(){
//     $scope.sync().prev();
//     syncWithService();
//   };

//   function partials(obj){
//     if (obj.stage === null) return;
//     var parts = [];
//     var stage = obj.stage;
//     // TODO: make this an injectable angular constant
//     var template = 'templates/stages/';
//     var name = config[stage].name;
//     function hardcode(part) {
//       return template + name + '/' + part;
//     }
//     for (var i = 0; i < config[stage].steps.length; i++) {
//       parts.push(hardcode(config[stage].steps[i].partial));
//     }
//     return parts;
//   }

//   $scope.$watch(
//     function(){ return $scope.sync().stage; },
//     function(newVal, oldVal){
//     if (newVal !== oldVal){
//       partials($scope.sync());
//     }
//   });

//   /// dev code ///
//   vm.areaone = function () {
//     var interactions = InteractionService;
//     var layers = LayerService;
//     var feature = layers.get('area').getSource().getFeatures()[0];
//     interactions.get('select').getFeatures().push(feature);
//   };
//   vm.areatwo = function () {
//     var interactions = InteractionService;
//     var layers = LayerService;
//     var feature = layers.get('area').getSource().getFeatures()[1];
//     interactions.get('select').getFeatures().push(feature);
// =======
//   ================================ */

  // setup initial values
  // for step and stage:
  var session_ref = Session.ref()
  var stage = 0;
  var step  = 0;
  // and partials
  // for dev: //////////////////////////////
  var new_session = true;
  new_session && session_ref.update({
                   stage: stage,
                   step:  step,
                 });
  // end dev: //////////////////////////////
  vm.partial = Templates.partial(stage,step);

  // view_sync helps flow control for async // TODO: more stream-like
  $scope.view_sync = true;

  // Session.stream().map(function (x) {
  //   x = x.val() || x;
  //   if (x.stage ) {
  //   }
  // })

  var session_stream = Session.stream()
  .map(function(x){
    return x.val() || x;
  })
  .subscribe(function handle_session_stream (data) {
    console.log('session update',data);
    if (data.stage !== stage) {
      $scope.view_sync = false;
      console.log('not equal stages');
      // $scope.view_sync = false;
      // update the stage on the client
      stage = data.stage;
      step  = data.step;
      // go to new state
      // updatePartials(data.stage, data.step);
      $state.go(Templates.config[data.stage].name, data.step).then(function(){

      });
    } else if ($scope.view_sync && data.step > step) {
      // $scope.view_sync = false;
      $scope.view_sync = false;
      console.log('syncd b4 next', $scope.view_sync)
      // step = data.step;
      vm.next(data.step);
    } else if ($scope.view_sync && data.step < step) {
      $scope.view_sync = false;
      console.log('syncd b4 prev', $scope.view_sync)
      // $scope.view_sync = false;
      // step = data.step;
      vm.prev(data.step);
    }
    // updatePartials(data.stage, data.step);
  });

  function updatePartials (state) {
    var stg, stp;
    stg = state.stage;
    stp = state.step;
    console.log('updatePartials', stg, stp);
    vm.partial = Templates.partial(stg,stp);
    !$scope.view_sync && $timeout(function () {
      !$scope.view_sync && $scope.$apply();
      session_ref.update(state);
      stage = state.stage;
      step = state.step;
      $scope.view_sync = true;
    }, 1);
  }

  // user flow controls
  vm.next = function(to){
    $scope.view_sync = false;
    var next_step, next_state, stage_end;
    next_step = to ? to : step + 1;
    stage_end = Templates.config[stage].steps.length - 1;
    next_state = {
      stage: next_step > stage_end ? stage+1 : stage,
      step:  next_step > stage_end ? 0 : next_step,
    };
    updatePartials(next_state);

  };

  vm.prev = function(to){
    $scope.view_sync = false;
    var target_state, target_step, target_steps_length;
    target_step = to ? to : step - 1;
    target_steps_length = stage === 0 ? Templates.config[stage].steps.length - 1 : Templates.config[stage-1].steps.length - 1
    target_state = {
      stage: stage >= 0 ? stage : stage - 1,
      step:  target_step >= 0 ? target_step : target_steps_length,
    }
    console.log('target_state', target_state);
    updatePartials(target_state);
// >>>>>>> Stashed changes
  };
  /// end dev code ///
}




function stateconstructor (stage, step) {
  var new_state = {stage: 0, step: 0};
  if (curr_stage > 0) {
    new_state.stage = curr_stage - 1;
  } else {
    new_state.stage = 0;
  }
  if (curr_step > 0 ) {
    new_state.step = curr_step - 1;
  } else if (curr_step === 0 && curr_stage ) {
    new_state.stage = last_step_prev_state
  }



  return new_state;
}
    // var prev_step, prev_state, prev_stage_end;
    // prev_step = to ? to : step - 1;
    // console.log('target_step', target_step)
    // // target_step < 0 && return
    // prev_stage_end = stage <= 0 ? Templates.config[0].steps.length -1: Templates.config[stage-1].steps.length -1; // null in the case that you're in Stage 0
    // prev_state = {
    //   stage: target_step < 0 && stage > 0 ? stage - 1 : stage,
    //   step:  target_step < 0 ? prev_stage_end : target_step,
    // }
    // console.log('prev_state', prev_state)
    // debugger;
    // updatePartials(prev_state);
