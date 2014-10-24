angular.module('steps.plan',[]).config( function StatesPlan($stateProvider) {
  $stateProvider.state("plan", {
    url:         "/plan",
    controller:  "PlanCtrl as plan",
    templateUrl: "templates/steps/plan/plan.html",
    abstract:    true,
  })
  .state("plan.type", {
    url:         "",
    views: {
      'planContent' :{
        templateUrl: 'templates/steps/plan/planContent.html',
        controller:  "",
      },
      'detailMenu' :{
        templateUrl: 'templates/steps/plan/detailMenu.html', 
        controller: "DetailCtrl as detail",
      },
      'helpMenu' :{
        templateUrl: 'templates/steps/plan/helpMenu.html', 
        controller: "HelpCtrl as help",
      }
    },
  })
;});
