/* ==================================================
  OdaCtrl
  the ODA tools controller
================================================== */

controllers.controller("OdaCtrl", ["$scope", "$element", "Clientstream", "Form", OdaCtrl_]);

function OdaCtrl_($scope, $element, Client, Form) {
  var vm = this;
  vm.prospect = Form.prospect;
  Client.listen('Form: Loaded', subscribeForm);

  // map and geocoder for ODA rooftop viewport
  var addy, rooftop_map, rooftop_div, rooftop_map_options, goc, marker;
  goc = new google.maps.Geocoder();
  rooftop_div = $('#odapindrop')[0]
  rooftop_map_options = {
    disableDefaultUI: true,
    keyboardShortcuts: false,
    draggable: false,
    mapTypeId: google.maps.MapTypeId.SATELLITE,
    disableDoubleClickZoom: true,
    scrollwheel: false,
    streetViewControl: true
  };

  rooftop_map = new google.maps.Map(rooftop_div, rooftop_map_options);
  rooftop_map.setZoom(20);
  rooftop_map.setTilt(0);



  vm.jumpToHome = function jumpToHome () {
    Client.emit('Stages: jump to stage', 'flannel.home');
  }

  vm.jumpToConfigurator = function jumpToConfigurator () {
    vm.prospect().skipped = false;
    Client.emit('Form: valid data', { skipped: false });
    Client.emit('Stages: jump to stage', 'flannel.configure');
  }

  vm.jumpToProposal = function jumpToProposal () {
    Client.emit('Stages: jump to stage', 'flannel.proposal');
  }

  vm.jumpToSchedule = function jumpToSchedule () {
    Client.emit('Stages: jump to stage', 'flannel.signup');
    setTimeout(function () {
      Client.emit('Stages: jump to step', 'qualify');
    }, 0)
  }

  function subscribeForm (form_obj) {
    // subscribing to form
    // vm.prospect = form_obj;
    Form.form_stream()
    .select(function(x) { return x.exportVal(); })
    .subscribe(streamSubscription);

    // drop a pin at Customer's rooftop the ODA tools
    if (form_obj.street) {
      addy = [form_obj.street, form_obj.city,form_obj.state, form_obj.zip ].join(', ');
      goc.geocode({address: addy}, function function_name (result, status) {
        rooftop_map.setCenter(result[0].geometry.location)
        marker = new google.maps.Marker({
          position: result[0].geometry.location,
          map: rooftop_map,
          draggable: false,
          icon: 'img/map-marker-house.png'
        })
      });
    }
  }

  function streamSubscription (form_obj) {
    // subscription made
    var key, keys, val;
    if (form_obj === null) return; // will be null if no data on firebase
    keys = Object.keys(form_obj);  // HACK: this may fail in different js interpreters... #readabookbrah
    if (!angular.equals(form_obj, vm.prospect)) { // firebase different from local
      for (var i = 0; i < keys.length; i++) {
        key = keys[i];
        val = form_obj[key];
      }
      setTimeout(function() {
        if (!$scope.$$phase) $scope.$apply(); // update the views
        // console.log('prospect is:', vm.prospect());
      }, 0);
    }
  }
}
