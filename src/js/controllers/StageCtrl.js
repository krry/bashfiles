controllers.controller("StageCtrl", ["$scope", "$state", "StageService", "InteractionService", "LayerService", "SyncService", "JwtService", "syncData", "StreamService", "Session", StageCtrl_]);

function StageCtrl_($scope, $state, StageService, InteractionService, LayerService, SyncService, JwtService, syncData, stream, Session) {
  // This controller should be used for anything that needs to control which partials are being used
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
      // debugger;
      // update the stage on the client
      // go to new state
        // TODO: figure out state name
        // TODO: refactor state to accept step&stage params
        $state.go(target_state, session);
    } else if (session.step !== step) {
      $scope.partial_sync = false;
      console.log('step was updated by server: ', session);
      // update the step
      step = session.step;
    }
    // after making changes, sync with the service.
      // send 'updateview' event

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
    stage = $scope.sync().stage;
    // step  = $scope.sync().step;
  }

  function updatePartials (stg, stp) {
    console.log('updating partials', stg, stp);
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

  // function partials(obj){
  //   console.log(obj)
  //   if (obj.stage === null) return;
  //   var parts = [];
  //   var stage = obj.stage;
  //   // TODO: make this an injectable angular constant
  //   var template = 'templates/stages/';
  //   var name = config[stage].name;
  //   function hardcode(part) {
  //     return template + name + '/' + part;
  //   }
  //   for (var i = 0; i < config[stage].steps.length; i++) {
  //     parts.push(hardcode(config[stage].steps[i].partial));
  //   }

  //   return parts;
  // }

  // $scope.$watch(
  //   function(){ return $scope.sync().stage; },
  //   function(newVal, oldVal){
  //   if (newVal !== oldVal){
  //     updatePartials($scope.sync().stage, $scope.sync().step);
  //   }
  // });
  // $scope.$watch(
  //   function(){ return $scope.sync().step; },
  //   function(newVal, oldVal){
  //   if (newVal !== oldVal){
  //     updatePartials($scope.sync().stage, $scope.sync().step);
  //   }
  // });

  /// dev code ///
  vm.areaone = function () {
    var interactions = InteractionService;
    var layers = LayerService;
    var feature = layers.get('area').getSource().getFeatures()[0];
    interactions.get('select').getFeatures().push(feature);
  };
  vm.areatwo = function () {
    var interactions = InteractionService;
    var layers = LayerService;
    var feature = layers.get('area').getSource().getFeatures()[1];
    interactions.get('select').getFeatures().push(feature);
  };
  /// end dev code ///
}
