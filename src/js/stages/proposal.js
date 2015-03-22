angular.module('proposal', []).config(["$stateProvider", function ($stateProvider) {

  // paths for this stage
  var stageName = 'proposal';
  // TODO: make these paths central and DRYer for all stages, changing based on stageName
  var templateUrl = "templates/";
  var stageUrl = templateUrl + "stages/" + stageName + '/';

  $stateProvider.state('flannel.proposal', {
    url: "^/proposal",
    resolve: {
      share_links: function ($http, Session) {
        return $http.get('/encodedURLs?email=butts&session_id='+Session.id()).
          success(function(data, status, headers, config) {
            // this callback will be called asynchronously
            // when the response is available
            return {links: data};
          }).
          error(function(data, status, headers, config) {
            // called asynchronously if an error occurs
            // or server returns response with an error status.
          });
      }
    },
    views: {
      'main@': {
        templateUrl: stageUrl + "main.html",
        controller: function ($scope, share_links) {
          var vm = this;
          debugger;
          wireShareLinks();

          function wireShareLinks() {
            console.log('share_links', share_links);
            vm.proposal_share = share_links.data.proposal_share;
            console.log(vm.proposal_share);
          }
        },
        controllerAs: 'share'
      },
    }
  })
;}]);
