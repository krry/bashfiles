angular.module('stages.configure',[]).config( function ($stateProvider) {
  
  // specifics for for this state
  var stageName = 'configure';
  var templateUrl = 'templates/';
  var stageUrl = 'templates/stages/' + stageName + '/';


  $stateProvider.state("configure", {
    url: "/configure",
    views: {
// replace the main ui-view @ index      
      'main@': {
        templateUrl: stageUrl + "main.html",
      },
// modify the new named views @ configure
      'map@configure': {
        templateUrl: stageUrl + "map.html",
        controller:  "",
      },
      'instructions@configure': {
        templateUrl: stageUrl + "instructions.html",
        controller:  "",
      },
// below here, still the same target as indexso, 
      'header@': {
        templateUrl: 'templates/header.html',
        controller:  'HeaderCtrl as head',
      },
      'footer@': {
        templateUrl: templateUrl + "footer.html",
        controller:  "",
      },
    },
  })
;});
