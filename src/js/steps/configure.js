angular.module('steps.configure',[]).config( function ($stateProvider) {
  $stateProvider.state("configure", {
    url: "",
    controller: "",
    abstract: true,
    views: {
      'header@': {
        templateUrl: 'templates/steps/configure/header.html',
        controller:  "",
      },
      'main@': {
        templateUrl: "templates/steps/configure/main.html",
        controller:  "",
      },
      'footer@': {
        templateUrl: "templates/steps/configure/footer.html",
        controller:  "",
      },
    },
  })
  .state("configure.zip", {
    url: '/zip',
    controller: '',
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
  .state("configure.address", {
    url: '/address',
    controller: '',
    views: {
      'address@configure': {
        templateUrl: "templates/steps/configure/main.address.html",
        controller:  "",
      },
    },
  })
;});
