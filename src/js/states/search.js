angular.module('states.search',[]).config( function searchState($stateProvider) {
  $stateProvider.state("search", {
    url: "/",
    templateUrl: "templates/states/search/search.html",
    controller: "SearchCtrl as search",
  });
});