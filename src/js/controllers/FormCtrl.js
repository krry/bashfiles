/* ==================================================
  FormCtrl
  the form controller
================================================== */

controllers.controller("FormCtrl", ["$scope", "UserService", "Session", "MapService", FormCtrl_]);

function FormCtrl_($scope, UserService, Session, MapService) {
  var vm = this;
  var valid = false; // use ng-valid from form
  vm.home = UserService.getHome();
  vm.prospect = UserService.getProspect;
  vm.monitorZip = monitorZip;
  vm.validZip = true;
  vm.validTerritory = true;
  vm.gmapShown = MapService.getGmapShown;
  vm.prevStep = prev;
  vm.nextStep = next;
  vm.geocodeAddress = MapService.geocodeAddress;

  function prev () {
    Session.prev();
  }

  function next () { // TODO: currently not checking if valid
    /* jshint -W030 */
    valid && Session.next();
    /* jshint +W030 */
  }

  function monitorZip () {
    console.log('monitoring zip field');
    var zip = vm.user.zip;

    if (typeof(zip) !== "undefined") {
      console.log(zip);
      MapService.setGmapShown(true);
      MapService.geocodeZip(zip, validateZip);
      // pass to checkTerritory API
        // if false, show out of territory state
        // if true, advance to address step
          // return mapService.initNearMe()
    }
  }

  function validateZip(result) {
    vm.validZip = result;
    console.log('validZip is', vm.validZip);
    checkTerritory(vm.user.zip, validateTerritory);
  }

  // TODO: move this to an API provider that sends data to the server which corresponds with proprietary APIs
  function checkTerritory(zip, cb) {
    console.log('checking if', zip, 'is in our territory');
    // return cb(false);
    return cb(true);

    // DON'T DELETE THIS: WE'LL NEED IT LATER
    // var msg, data = 'zip='+zip.toString()
    // // console.log('data is ' + data)
    // if (zip != null) {
    //   $.ajax({
    //     url: '//scexchange.solarcity.com/scfilefactory/app_handler/checkTerritory.ashx',
    //     //url: '//slc3web00.solarcity.com/scexchange/app_handler/checkTerritory.ashx',
    //     type: 'POST',
    //     data: data,
    //     dataType: 'json',
    //     error: function(){
    //       console.log('API not reachable')
    //       // checkZipDB(zip, res)
    //     },
    //     success: function(data) {
    //       // data = {'InTerritory' : 'false/true'}
    //       // console.log(typeof(data))
    //       // console.log(data)
    //       if (data['InTerritory']) {
    //         // msg = 'We service ' + zip
    //         res(true)
    //       } else {
    //         // msg = 'We do not yet service ' + zip
    //         res(false)
    //       }
    //     }
    //   })
    // }
  }

  function validateTerritory(result) {
    vm.validTerritory = result;
    console.log('inTerritory is', vm.validTerritory);
    valid = true;
    next();
  }
}
