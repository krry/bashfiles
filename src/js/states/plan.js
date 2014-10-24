angular.module('states.plan',[]).config( function StatesPlan($stateProvider) {
  $stateProvider.state("plan", {
    url:         "/plan",
    controller:  "PlanCtrl as plan",
    templateUrl: "templates/states/plan/plan.html",
    abstract:    true,
  })
  .state("plan.type", {
    url:         "",
    views: {
      'planContent' :{
        templateUrl: 'templates/states/plan/planContent.html',
        controller:  "",
      },
      'detailMenu' :{
        templateUrl: 'templates/states/plan/detailMenu.html', 
        controller: "DetailCtrl as detail",
      },
      'helpMenu' :{
        templateUrl: 'templates/states/plan/helpMenu.html', 
        controller: "HelpCtrl as help",
      }
    },
  })
;});
