angular.module('steps.home',[]).config( function ($stateProvider) {
  
  // specifics for for this state
  var stateName = 'home';
  var baseUrl = 'templates/steps/' + stateName + '/';
  

  $stateProvider.state("home", {
    url: "",
    abstract: true,
    views: {
      'header@': {
        templateUrl: baseUrl + "header.html",
        controller:  "",
      },
      'main@': {
        templateUrl: baseUrl + "main.html",
        controllerAs: 'home',
        controller: function HomeCtrl($scope){
          var vm = this;
          vm.steps = [ 
            { step: 'zip-nearme',   url: baseUrl + 'main.zip.html'},
            { step: 'address-roof', url: baseUrl + 'main.address.html'},
          ];
          vm.step = vm.steps[0];
          console.log(vm.step)
        },
      },
      'footer@': {
        templateUrl: baseUrl + "footer.html",
        controller:  "",
      },
    },
  })
  .state("home.zip", {
    url: '/zip',
    views: {
      'overlay@home': {
        templateUrl: baseUrl + "overlay.html",
        controller:  "",
      },
      'underlay@home': {
        templateUrl: baseUrl + "underlay.html",
        controller:  "",
      },
    },
  })
;});
