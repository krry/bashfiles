angular.module('steps.configure',[]).config( function ($stateProvider) {
  $stateProvider.state("configure", {
    url: "",
    abstract: true,
    views: {
      'header@': {
        templateUrl: 'templates/steps/configure/header.html',
        controller:  "",
      },
      'main@': {
        templateUrl: "templates/steps/configure/main.html",
        controllerAs: 'configure',
        controller: function ConfigureCtrl($scope){
          var vm = this;
          var baseUrl = 'templates/steps/configure/';
          vm.steps = [ 
            { step: 'zip-nearme',   url: baseUrl + 'main.zip.html'},
            { step: 'address-roof', url: baseUrl + 'main.address.html'},
          ];
          vm.step = vm.steps[0];
        },
      },
      'footer@': {
        templateUrl: "templates/steps/configure/footer.html",
        controller:  "",
      },
    },
  })
  .state("configure.initial", {
    url: '/zipp',
    views: {
      'overlay@configure': {
        templateUrl: "templates/steps/configure/overlay.html",
        controller:  "",
      },
      'underlay@configure': {
        templateUrl: "templates/steps/configure/underlay.html",
        controller:  "",
      },
    },
  })
;});
