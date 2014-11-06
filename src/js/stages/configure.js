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
        controller:  "MapCtrl as map",
      },
      'instructions@configure': {
        templateUrl: stageUrl + "instructions.html",
        controller:  "",
      },
      // below here, still the same target as index, 
      'header@': {
        templateUrl: templateUrl + 'header.html',
        controller:  "HeaderCtrl as header",
      },
      'footer@': {
        templateUrl: templateUrl + "footer.html",
        controller:  "FooterCtrl as footer",
      },
    },
  })
;});
