// TODO: import the useful of these functions into controllers or link functions

(function(){

  var log = function(msg) {
    try {
      console.log(msg);
    }
    catch(e) {}
  };

  var goToByScroll = function(data_slide) {
    htmlbody = $('html,body');
    htmlbody.animate({
        scrollTop: $('[data-slide="' + data_slide + '"]').offset().top
    }, 500, 'easeInOutCubic');
  };

  var zipCheck = function(id){
    log("zipCheck got called");
    log('wiring up keyup event listener to element with id ' + id);
    $('#'+id).on("focus", function(){
    });
    $("#"+id).on("keyup", function(e){
      log('a key was upped while focused on the "' + id + '" element');
      console.log('effing working');
      var $zipVal = $(this).val();
      var key = e.keyCode || e.which;
      var arrows = [9,16,37,38,39,40];
      if (arrows.indexOf(key) < 0){
        if ($zipVal.length === 5 && !current.geoLock) {
          current.step = 1;
          current.zip = $zipVal;
          current.map = roofMap;
          current.geoLock = true;
          // log("firing zip geocode for " + current.zip);
          Roofer.reverseGeocode(current.zip, current.zip);
        }
      }
    });
  };

  var checkTerritory = function(zip) {
    var data = 'zip='+zip.toString();
    // console.log('data is ' + data);
    if (zip !== null) {
      $.ajax({
        url: '//scexchange.solarcity.com/scfilefactory/app_handler/checkTerritory.ashx',
        // url: '//slc3web00.solarcity.com/scexchange/app_handler/checkTerritory.ashx',
        type: 'POST',
        data: data,
        dataType: 'json',
        error: function(){
          // console.log("checkTerritory API is unavailable. Using backup database.");
          fst.checkZipDB(zip);
        },
        success: function(data) {
          // data = {'InTerritory' : 'false/true'}
          // console.log(typeof(data));
          // console.log(data);
          if (data.InTerritory) {
            fst.goodAddy('We service that area.');
          }
          else {
            fst.badAddy('We do not yet service that area.');
          }
          return $('#street').focus();
        }
      });
    }
  };

  var checkZipDB = function(zip) {
    // fst.log('checking territory for ' + zip);
    if (zip !== null) {
      $.ajax({
        url: '../check/zip',
        type: 'POST',
        data: {'zip': zip},
        error: function(jqXHR, textStatus, errorThrown) {
          // console.log('zipCheck ajax POST error:');
          // console.log(jqXHR);
          // console.log(textStatus);
          // console.log(errorThrown);
          fst.badAddy('The territory check service is unavailable.');
        },
        success: function(data, textStatus, jqXHR) {
          var loc = JSON.parse(data);
          // console.log("zip db response: ");
          // console.log(loc);
          if (loc.length > 0) {
            fst.goodAddy('We service that area');
          }
          else {
            fst.badAddy('We do not yet service that area.');
          }
        }
      });
    }
  };

  //initialize variables
  var current = {
    step: 0
  };

  var roofMap, geocoder, marker, maptions;
  var territory = ["CA", "TX", "NY", "NJ", "AZ", "CT", "DE", "HI", "MD", "MA", "OR", "PA", "DC", "WA", "CO"];

  var inits = {
    zoom: 4,
    country: "United States"
  };

  maptions = {
    zoom : inits.zoom,
    minZoom : inits.zoom,
    maxZoom : inits.zoom,
    mapTypeId : google.maps.MapTypeId.HYBRID,
    // disableDefaultUI: true,
    // draggable: false,
    scrollWheel: false,
    backgroundColor: "transparent"
  };

  var maxZoomService = new google.maps.MaxZoomService();

  //class to hold methods
  var Roofer = {
    // initialize a particular map in a div given an id
    initMap: function(step, canvas_id) {
      roofMap = new google.maps.Map(document.getElementById(canvas_id), maptions);
      current.map = roofMap;
      roofMapShown = true;
    },
    //ask for the visitor's location from the DOM and pass it to be parsed
    getLocation: function(map) {
      if(navigator.geolocation) {
        current.map = map;
        navigator.geolocation.getCurrentPosition(Roofer.parseLocation);
      }
      else {
        fst.badAddy("Geolocation is not supported by this browser.");
      }
    },

    // parse the geolocation of the DOM into latlng object and pass that to the geocoder
    parseLocation: function(position) {
      current.lat = position.coords.latitude;
      current.lng = position.coords.longitude;
      current.latlng = new google.maps.LatLng(current.lat, current.lng);
      Roofer.geoLocate(current.latlng);
    },

    // given the latlng object, geolocate the visitor on a google map
    geoLocate: function(latlng) {
      geocoder = new google.maps.Geocoder();
      geocoder.geocode({'latLng': latlng}, function(results, status){
        if (status == google.maps.GeocoderStatus.OK) {
          if (results[0]) {
            Roofer.handleGeocode(results[0]);
            Roofer.parseAddress(results[0]);
          }
          else { fst.badAddy("No known domiciles nearby."); }
        }
        else { fst.badAddy("Geocoder failed due to: " + status); }
      });
    },

    // method of retrieving a geolocation given an address
    reverseGeocode: function(address, zip) {
      geocoder = new google.maps.Geocoder();
      var components = {"country": "US"};
      if (zip !== "") {
        components.postalCode = zip;
      }
      geocoder.geocode({
        "address": address,
        "componentRestrictions": components
      }, function(results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
          if (results[0]) {
            Roofer.handleGeocode(results[0]);
            Roofer.parseAddress(results[0]);
          }
        } else if (status === google.maps.GeocoderStatus.ZERO_RESULTS) {
        return fst.badAddy("Can't find that location.");
        } else if (status === google.maps.GeocoderStatus.OVER_QUERY_LIMIT) {
          setTimeout(Roofer.reverseGeocode(address, zip), 200);
        } else if (status === google.maps.GeocoderStatus.REQUEST_DENIED) {
          return fst.badAddy("The geocoder needs an additional parameter.");
        } else {
          if (status === google.maps.GeocoderStatus.INVALID_REQUEST) {
            return fst.badAddy("The geocode request was invalid. Address or latlng may be missing.");
          }
        }
      });
    },

    handleGeocode: function(results) {
      current.latlng = results.geometry.location;
      current.zoom = Roofer.properZoom(current.latlng);
      Roofer.updateMap(current.map, current.zoom, current.latlng);
    },

    //method of updating an already initialized map with a new center and zoom
    updateMap: function(map, zoom, latlng) {
      current.map = map;
      current.latlng = latlng;
      maptions.center = current.latlng;
      maptions.zoom = zoom;
      maptions.maxZoom = zoom;
      current.map.setOptions(maptions);
      current.map.setZoom(maptions.zoom);
      // fst.log('current addy is ', current.addy)
    },

    //drop a pin at the latlng at which the map is center
    dropPin: function(map, latlng) {
      if(typeof(marker)!=="undefined") {
        marker.setMap(null);
        marker = null;
      }
      if (current.known){
        // fst.log("dropping pin on addy " + current.addy);
        marker = new google.maps.Marker({
          position: latlng,
          map: map,
          draggable: true
        });
      }
    },

    //once a visitor's location is reverse geocoded, parse it into an address
    parseAddress: function(location) {
      var address = location.address_components;
      // fst.log(address);
      // reset global address storage variables
      if(typeof(current.stno)!=="undefined") {
        current.stno = "";
        current.street = "";
        current.city = "";
        current.state = "";
        current.zip = "";
        current.addy = "";
      }
      // iterate through the array of address_components
      for (var i=0; i<address.length; i++) {
        if (address[i].types[0]=="postal_code") {
          if (typeof(address[i].long_name) !== "undefined") {
            current.zip = address[i].long_name;
        }}
        if (address[i].types[0]=="administrative_area_level_1") {
          if (typeof(address[i].short_name) !== "undefined") {
            current.state = address[i].short_name;
            // fst.log('setting state to ', current.state);
        }}
        if (address[i].types[0]=="locality") {
          if (typeof(address[i].long_name) !== "undefined") {
            current.city = address[i].long_name;
        }}
        if (address[i].types[0]=="route") {
          if (typeof(address[i].short_name) !== "undefined") {
            current.street = address[i].short_name;
            // fst.log("street set to " + current.street);
        }}
        if (address[i].types[0]=="street_number") {
          if (typeof(address[i].long_name) !== "undefined") {
            current.stno = address[i].long_name;
        }}
        if (address[i].types[0] === "country") {
          if (typeof(address[i].short_name) !== "undefined") {
            current.country = address[i].short_name;
        }}
      }

      if (typeof(current.street)!=="undefined" && typeof(current.stno)!=="undefined") {
        // fst.log("updating street address");
        current.addy = current.stno + " " + current.street;
        // fst.log(current.addy);
      }

      //return values of address components to be saved in form fields
      if (current.country !== 'US') {
        return fst.badAddy("Invalid ZIP code");
      } else if (current.zip) {
        if (typeof(current.addy)!=="undefined" && current.addy !== "Street Address" && current.addy !== " " && current.addy !== "") {
          Roofer.dropPin(current.map, current.latlng);
        }
        fst.printAddress(current.addy, current.city, current.state, current.zip);
        fst.checkTerritory(current.zip);
      }
    },

    // method of finding out the proper zoom for the step the visitor is on
    properZoom: function(latlng) {
      switch (current.step) {
        case 0:
          return 4;
        case 1:
          return 13;
        case 2:
          return 20;
        default:
          return 4;
      }
    },

    //method of getting the maximum zoom for a point on a map for rooftop viewing
    getMaxZoom: function(latlng) {
      maxZoomService.getMaxZoomAtLatLng(latlng, function(response) {
        if (response.status != google.maps.MaxZoomStatus.OK) {
          //TODO find the right call to turn on zoom
          maptions.zoomControl = true;
          return 17;
        }
        else if (response.status == google.maps.MaxZoomStatus.OK) {
          // fst.log("max zoom response is " + response.zoom);
          return response.zoom;
        }
        else {
          // fst.log("waiting on maxZoomService");
        }
      });
    },

    //check if address is complete, and if so reverse geocode and update the map
    sendAddress: function() {
      // fst.log("sending address");
      // fst.log("addy being passed to input is " + current.addy);
      // fst.log("packaged address: " + current.address);
      Roofer.reverseGeocode(current.address, current.zip);
      if (typeof(current.addy)!=="undefined" && current.addy !== "Street Address" && current.addy !== " " && current.addy !== "") {
        current.known = true;
        fst.saveBingLink();
        fst.saveGmapLink();
      }
    },
  };

  zipCheck("hood_check");

})(this);
