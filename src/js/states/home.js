angular.module('states.home',[]).config( function ($stateProvider) {
  $stateProvider.state("home", {
    url: "/",
    controller: "HomeCtrl",
    templateUrl: "templates/states/home/home.html",
  });
});
