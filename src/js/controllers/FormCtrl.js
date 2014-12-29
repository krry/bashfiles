/* ==================================================
  FormCtrl
  the form controller
================================================== */

controllers.controller("FormCtrl", ["$scope", "UserService", "Session", "MapService", FormCtrl_]);

function FormCtrl_($scope, UserService, Session, MapService) {
  var vm = this;

  vm.user = UserService.get;

  vm.monitorZip = monitorZip;

  vm.validZip = true;
  vm.validTerritory = true;
  vm.gmapShown = MapService.getGmapShown;

  function next () { // TODO: currently not checking if valid
    valid && Session.next();
  }

  function monitorZip () {
    console.log('monitoring zip field');
    var zip = vm.user.zip;

    if (zip.length === 5) {
      valid = true;
      next();
    } else if (typeof(zip) !== "undefined") {
      console.log(zip);
      MapService.setGmapShown(true);
      MapService.updateGmap({ "postalCode": zip }, validateZip);
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
  }

  function populateAddress () {
    console.log('parsing address');
    // TODO: use zip code to fill in city and state
    // package and send full address to Google Maps API for sanitation
    // populate sanitized address in the address fields
    // center map on latlng of address
    // check if street address present in sanitized address
      // if so, drop map marker on this location
  }

}
