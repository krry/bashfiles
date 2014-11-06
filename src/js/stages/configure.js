// configure.js stage
angular.module('stage.configure', []).config( function ($stateProvider) {
  
  // paths for this state
  var stageName = 'configure';
  // TODO: make these paths central and DRYer for all stages, changing based on stageName
  var templateUrl = "templates/";
  var stageUrl = templateUrl + "/stages/" + stageName + '/';

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
