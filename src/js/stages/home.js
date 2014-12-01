// home.js stage
angular.module('stages.home',[]).config( function ($stateProvider) {
  
  // paths for this state
  var stageName = 'home';
  // TODO: make these paths central and DRYer for all stages, changing based on stageName
  var templateUrl = "templates/";
  var stageUrl = templateUrl + "/stages/" + stageName + '/';

  // state definition
  $stateProvider.state("home", {
    url: "/home",
    views: {
      'dev@': {
        templateUrl: templateUrl + 'dev.html',
        controller:  'DevCtrl as dev',
      },
      'header@': {
        templateUrl: templateUrl + 'header.html',
        controller:  'HeaderCtrl as head',
      },
      'main@': {
        resolve: {
          // design_ref: function ($q, SyncService, firebaseRef) {
          //   var defer = $q.defer();
          //   SyncService.get('design_ref') || firebaseRef('/designs').push()
          //   .once( 'value', function (dataSnapshot) {
          //     defer.resolve(SyncService.set('design_ref', dataSnapshot));
          //     console.log('your design id is new: ', dataSnapshot.key());
          //   });
          //   return defer.promise;
          // },
        },
        templateUrl: stageUrl + "main.html",
        // controllerAs: 'form',
        // controller:  function form_ctrl ($scope, $firebase, SyncService, firebaseRef, design_ref) {
        //   // the design_ref may be set by arriving from a share link, or should be generated new
        //   var vm = this;
        //   vm.user = $firebase(design_ref).$set('user',{
        //     zip: "",
        //     state: "",
        //     city: "",
        //     address: "",
        //     design_id: "",
        //     name: {
        //       first_name: "",
        //       last_name: ""
        //     },
        //     is_homeowner: null, // boolean
        //     phone: "",
        //     email: "",
        //     dob: {
        //       month: "",
        //       day: "",
        //       year: ""
        //     },
        //   }).then(function(data){
        //     // TODO: get that promise resolved!!!
        //     return $firebase(data).$asObject()});
        //   vm.checkZip = checkZip;
        //   function checkZip (zip) {
        //     // debugger;
        //     console.log("checking zip");
        //     console.log(zip);
        //   };
        //   function parseAddress (address) {
        //     console.log("parsing address");
        //     console.log(address);
        //   }
        // },
      },
      'overlay@home': {
        templateUrl: stageUrl + "overlay.html",
      },
      'underlay@home': {
        templateUrl: stageUrl + "underlay.html",
      },
      'footer@': {
        templateUrl: templateUrl + 'footer.html',
      },
    },
  })
;});
