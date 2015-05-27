angular.module('session_reset', []).config(["$stateProvider", function ($stateProvider) {
  $stateProvider.state("session_reset", {
    url: "/reset"
  })
;}]);
