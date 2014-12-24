controllers.controller("StageCtrl", ["$scope", "$state", "StageService", "InteractionService", "LayerService", "SyncService", "JwtService", "syncData", "StreamService", "Session", StageCtrl_]);

function StageCtrl_($scope, $state, StageService, InteractionService, LayerService, SyncService, JwtService, syncData, stream, Session) {
  // This controller should be used for anything that needs to control which partials are being used
  console.log('*(***************************************************** STAGECTRL LOADING')
  var vm = this;
  var config = StageService.config;
  $scope.sync  = StageService.syncObj;
  // stage & step index numbers

  // init
  JwtService.jwt();
  vm.partials = StageService.partials;
  vm.partial = vm.partials[0][0];

// /////////////////////////////////////////////////
  // set initial values for step and stage:
  var stage = 0;
  var step  = 0;

  var session_ref = SyncService.get('session_ref');

  $scope.partial_sync = true;

  var session_stream = Session.subscribe(function handle_session_stream (data) {
    var session = data.val();
    var target_state;
    console.log('session in session stream subscription: ', session);
    if (session.stage !== stage) {
      $scope.partial_sync = false;
      target_state = vm.partials[session.stage][0].split('/')[2];
      // update the stage on the client
      stage = session.stage;
      // go to new state
      updatePartials(stage);
      $state.go(target_state)
    }
    if (session.step !== step) {
      $scope.partial_sync = false;
      console.log('step was updated by server: ', session);
      // update the step
      step = session.step;
    }
    if (!$scope.session_synchronized) {
      console.log('calling sync: *************** ');
      syncWithService();
    }
  });


  function syncWithService() {
    updateUi();
    console.log('sync with service: stage,step', stage, step)
    updatePartials(stage, step);
  }

  function updateUi () {
    // stage = $scope.sync().stage;
    // step  = $scope.sync().step;
  }

  function updatePartials (stg, stp) {
    stp = stp || step;
    vm.partial = StageService.partials[stg][stp];
    $scope.partial_sync = true;
    $scope.$apply();
  }

  var client_stream = new stream()
  client_stream.listen('change', function handle_server_diff (data) {
    console.log(' (((((((((((((((((((((((((( handle server step, data: ', data);
    session_ref.update(data);
  });

// /////////////////////////////////////////////////
  vm.next = function(){
    $scope.sync().next();
    syncWithService();
  };
  vm.prev = function(){
    $scope.sync().prev();
    syncWithService();
  };

  // /// dev code ///
  // vm.areaone = function () {
  //   var interactions = InteractionService;
  //   var layers = LayerService;
  //   var feature = layers.get('area').getSource().getFeatures()[0];
  //   interactions.get('select').getFeatures().push(feature);
  // };
  // vm.areatwo = function () {
  //   var interactions = InteractionService;
  //   var layers = LayerService;
  //   var feature = layers.get('area').getSource().getFeatures()[1];
  //   interactions.get('select').getFeatures().push(feature);
  // };
  // /// end dev code ///
}
