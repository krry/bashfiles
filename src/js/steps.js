angular.module('flannel').config(["$stateProvider", "TemplateConfigProvider", function ($stateProvider, Templates) {
  function constructAll() {
    var stages = Templates.config,
        route, stage, step;

    for (var i = 0, stageLen = stages.length; i < stageLen; i++) {
      stage = stages[i];

      for (var j = 0, stepLen = stage.steps.length; j < stepLen; j++) {
        step = stage.steps[j];

        route = {};
        route.stage = i;
        route.step = j;
        route.stageName = stage.name;
        route.stepName = step.step;
        constructRoute(route);
      }
    }
  }

  function constructRoute(route) {
    var views = {};
    views['partial@' + route.stageName] = {
      templateUrl: Templates.partial(route.stage, route.step)
    };

    $stateProvider.state(route.stageName + '.' + route.stepName, {
      url: '/' + route.stepName,
      views: views
    });
  }

  constructAll();
}]);
