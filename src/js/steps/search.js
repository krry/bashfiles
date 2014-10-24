angular.module('steps.search',[]).config( function searchState($stateProvider) {
  $stateProvider.state("search", {
    url: "/search",
    templateUrl: "templates/steps/search/search.html",
    controller: "SearchCtrl as search",
  });
});