angular.module('stages',[
  'stage.home',
  'stage.configure',
  'stage.qualify',
  'stage.signup',
])
.config(function ($stateProvider, $urlRouterProvider) {
  $stateProvider.templateUrl = "templates/"
  $stateProvider.stageTemplateUrl = "templates/stages/"
  $urlRouterProvider.otherwise('/');
});
