angular.module('session_link', []).config(["$stateProvider", function ($stateProvider) {
  $stateProvider.state("session_link", {
    url: "/session/:session_ref_key/:stage/:step"
  })
;}]);
