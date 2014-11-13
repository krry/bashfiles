describe('Unit: StageService_', function() {

  // beforeEach(module('flannel'));
  // beforeEach(module('ui.router'));
  beforeEach(module('flannel'));

  var ctrl, scope;

  beforeEach(inject(function (_StageService_, $state) {
    stageService = _StageService_;
    state = $state;
  }));

  it('should create $scope.greeting when calling sayHello',
    function() {
      expect(stageService.syncObj().next()).toEqual(0);
  });

})
