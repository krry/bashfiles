controllers.controller("StageCtrl", ["$scope", "$state", "StageService", "InteractionService", "LayerService", "SyncService", "JwtService", "syncData", StageCtrl_]);

function StageCtrl_($scope, $state, StageService, InteractionService, LayerService, SyncService, JwtService, syncData) {
  // This controller should be used for anything that needs to control which partials are being used
  var vm = this;
  var config = StageService.config;
  $scope.sync  = StageService.syncObj;
  // stage & step index numbers
  var stage = $scope.sync().stage;
  var step  = $scope.sync().step;

  // init
  JwtService.jwt();
  vm.partials = StageService.partials;
  vm.partial = vm.partials[0][0];

  function updateUi () {
    stage = $scope.sync().stage;
    step  = $scope.sync().step;
  }

  function syncWithService() {
    updateUi();
    console.log('sync with service: stage,step', stage, step)
    updatePartials(stage, step);
  }

  function updatePartials (stg, stp) {
    // vm.partials = StageService.partials[stg];
    console.log('should update partials', arguments)
    vm.partial = StageService.partials[stg][stp];
    $scope.$apply();
  }

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

  $scope.$watch(
    function(){ return $scope.sync().stage; },
    function(newVal, oldVal){
    if (newVal !== oldVal){
      updatePartials($scope.sync().stage, $scope.sync().step);
    }
  });
  $scope.$watch(
    function(){ return $scope.sync().step; },
    function(newVal, oldVal){
    if (newVal !== oldVal){
      updatePartials($scope.sync().stage, $scope.sync().step);
    }
  });

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
