function StageCtrl_($scope, $state, StageService, InteractionService, LayerService, SyncService, syncData) {

  // This controller should be used for anything that needs to control which partials are being used
  var vm = this;
  var config = StageService.config;

  // TODO: this should set the state on the FB object, and we can watch that later
  // get a FirebaseRef for this design
  $scope.designRef = syncData('/designs')

  // set the current state
  // DEV HACK: only for testing sync'd objects. return to $push when we're
  // ready to test multiple users
  // .$push({'state': 'test_state'})
  .$set('ace', {'state': 'test_state'})
  .then( function (data) {
    // store FirebaseRef to syncObj
    SyncService.set('designRef', data);
  });

  $scope.sync  = StageService.syncObj;
  // stage & step index numbers
  var stage = $scope.sync().stage;
  var step  = $scope.sync().step;

  // init
  vm.partials = partials($scope.sync());
  vm.partial = vm.partials[0];

  function syncWithService() {
    stage = $scope.sync().stage;
    step  = $scope.sync().step;
    vm.partials = partials($scope.sync());
    vm.partial = vm.partials[step];
  }

  vm.next = function(){
    $scope.sync().next();
    syncWithService();
  };
  vm.prev = function(){
    $scope.sync().prev();
    syncWithService();
  };

  function partials(obj){
    if (obj.stage === null) return;
    var parts = [];
    var stage = obj.stage;
    // TODO: make this an injectable angular constant
    var template = 'templates/stages/';
    var name = config[stage].name;
    function hardcode(part) {
      return template + name + '/' + part;
    }
    for (var i = 0; i < config[stage].steps.length; i++) {
      parts.push(hardcode(config[stage].steps[i].partial))
    }
    return parts;
  }

  $scope.$watch(
    function(){ return $scope.sync().stage; },
    function(newVal, oldVal){
    if (newVal !== oldVal){
      partials($scope.sync());
    }
  })

  /// dev code ///
  vm.areaone = function () {
    var interactions = InteractionService;
    var layers = LayerService;
    var feature = layers.get('area').getSource().getFeatures()[0];
    interactions.get('select').getFeatures().push(feature);
  }
  vm.areatwo = function () {
    var interactions = InteractionService;
    var layers = LayerService;
    var feature = layers.get('area').getSource().getFeatures()[1];
    interactions.get('select').getFeatures().push(feature);
  }
  /// end dev code ///
}

controllers.controller("StageCtrl", StageCtrl_);
