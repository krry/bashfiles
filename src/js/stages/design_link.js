angular.module('stages.design_link',[]).config( function ($stateProvider) {

  // specifics for for this state
  var stageName = 'design_link';

  // state definition
  $stateProvider.state("design_link", {
    url: "/design_link",
    controller: function design_linkCtrl () {

    },
  })
;});
