/* =========================================================

  GeocoderProvider

  provides a geocoder along with such services

  emits results to the Clientstream
  to which geocoding controllers listen

========================================================= */

providers.provider("Geocoder", [GeocoderProvider_]);

function GeocoderProvider_ () {

  this.$get = [ "Clientstream", function (Client) {

    var geocoder,
        addy,
        addyKeys,
        territoryChecked;

    territoryChecked = false;
    addy = {};
    addyKeys = [' zip', 'city', 'state', 'street' ];

    Client.listen('valid territory', function(){
      console.log('caching valid territory');
      territoryChecked = true;
    })

    // send a latlng object and receive an address
    function reverseGeocode(latLng) {
      var location;
      var geocoder = new google.maps.Geocoder();
      geocoder.geocode({'location': latLng}, function(results, status){
        if (status === google.maps.GeocoderStatus.OK) {
          if (results[0]) {
            location = results[0].geometry.location;
            parseLocation(results[0]);
          }
          else {
            console.error("Error: No known domiciles nearby.");
            location = false;
          }
        }
        else {
          console.error("Geocoder failed due to: ", status);
          location = false;
        }
      });
      return location;
    }

    // pack the request as a nice little object and send it off to geocode camp
    function sendGeocodeRequest (request) {
      var addyStr,
          numbersOnly,
          geocodeRequest,
          // components,
          geocoder;

      addyStr = "";
      numbersOnly = new RegExp('^[0-9]');
      // components = { "country": "US" };
      geocoder = new google.maps.Geocoder();

      // if the request is string...
      if (typeof request === "string") {
        addyStr = request;
        // if the request is 5 numbers long, package it as a zip code
        if (addyStr.length === 5 && numbersOnly.test(addyStr)) {
          addy.zip = addyStr;
        }
        // else if the request could be an address and we have a zipcode cached
        else if (addyStr.length > 3 && addy.zip) {
          // add it as the addy.address
          addy.address = addyStr;
        }
        // else try to geocode/emit error
        else {
          Client.emit('invalid geocode request', false);
        }
      }
      // else if the request is an object...
      else if (typeof request === "object") {
        // save the object as the cached addy
        // TODO: check if request obj would overwrite more valuable cached addy
        console.log('geocode requested for object', request);
        addy = request;
      }
      // else error state
      else {
        Client.emit('invalid geocode request', false);
      }

      if (addy !== {} && typeof addy !== "undefined") {
        for (var key in request) {
          if (request.hasOwnProperty(key)){
            // if it has a key named 'zip', 'city', 'state', or 'address', run it through the addy object stringifier
            if (addyKeys.indexOf(key) > -1) {
              console.log("appending", key,"to addy string");
              if (request[key]){
                if (addyStr.length === 0) {
                  addyStr = request[key];
                }
                else {
                  addyStr = addyStr + " " + request[key];
                }
              }
              // components[key] = request[key];
            } // else { do nothing }
          }
        }

        geocodeRequest = { "address": addyStr };
        console.log('sending', geocodeRequest, 'to geocoder');
        geocoder.geocode(geocodeRequest, handleGeocodeResults);
      }
    }

    // handle geocode errors, and if successful save and use the results
    function handleGeocodeResults(results, status) {
      console.log('geocode results received', results);
      if (status === google.maps.GeocoderStatus.OK) {
        if (results[0]) {

          console.log('geocode successful:', results);
          // cache the location as the center
          addy.location = results[0].geometry.location;
          Client.emit('center changed', addy.location);
          console.log('center plotted at:', addy.location);
          // parse the results into an address
          parseLocation(results[0]);
        }
      }
      else if (status === google.maps.GeocoderStatus.ZERO_RESULTS) {
        console.error("Can't find that location.");
        Client.emit('geocode results', false);
      }
      else if (status === google.maps.GeocoderStatus.OVER_QUERY_LIMIT) {
        console.error("Over query limit, retrying...");
        setTimeout(function(){ sendGeocodeRequest(addy); }, 2000);
      }
      else if (status === google.maps.GeocoderStatus.REQUEST_DENIED) {
        console.error("The geocoder needs an additional parameter.");
        Client.emit('geocode results', false);
      }
      else {
        if (status === google.maps.GeocoderStatus.INVALID_REQUEST) {
          console.error("The geocode request was invalid. Address or latLng may be missing.");
          Client.emit('geocode results', false);
        }
        else {
          Client.emit('geocode results', false); // return status;
        }
      }
    }

    // send results to parseLocation from geocodeAddress
    function parseLocation(results) {
      var parsedress,
          response;

      parsedress = results.address_components
      console.log('parsing address', results.address_components);

      // iterate through the array of address_components
      for (var i=0; i<parsedress.length; i++) {
        if (parsedress[i].types[0]==="postal_code") {
          if (typeof parsedress[i].long_name !== "undefined") {
            addy.zip = parsedress[i].long_name;
        }}
        if (parsedress[i].types[0]==="administrative_area_level_1") {
          if (typeof parsedress[i].short_name !== "undefined") {
            addy.state = parsedress[i].short_name;
        }}
        if (parsedress[i].types[0]==="locality") {
          if (typeof parsedress[i].long_name !== "undefined") {
            addy.city = parsedress[i].long_name;
        }}
        if (parsedress[i].types[0]==="route") {
          if (typeof parsedress[i].short_name !== "undefined") {
            addy.street = parsedress[i].short_name;
        }}
        if (parsedress[i].types[0]==="street_number") {
          if (typeof parsedress[i].long_name !== "undefined") {
            addy.stno = parsedress[i].long_name;
        }}
        if (parsedress[i].types[0] === "country" ? typeof parsedress[i].short_name !== "undefined" : void 0) {
          addy.country = parsedress[i].short_name;
        }
      }

      // return values of address components to be saved in form fields
      if (addy.country !== 'US') {
        Client.emit('outside US', false);
      }
      else {
        // TODO: determine whether the zip checks are happening in the right order
        // if (addy.zip && !territoryChecked) {
        //   Client.emit('valid zip', addy.zip);
        //   // check if the valid zip is in our territory
        //   checkTerritory(addy.zip);
        // }
        if (addy.zip) {
          checkTerritory(addy.zip);
        }
        if (addy.state) {
          Client.emit('valid state', addy.state);
        }
        if (addy.city) {
          Client.emit('valid city', addy.city);
        }
        if (addy.street) {
          Client.emit('valid address', addy.street);
          if (addy.stno) {
            Client.emit('Gmap: switch to satellite', true);
            addy.home = addy.stno + " " + addy.street;
            Client.emit('valid house', addy);
          }
        }
      }
    }

    function checkTerritory(zip) {
      // if zip is in territory, emit that
      console.log('checking if', zip, 'is in our territory');
      addy.zoom = 15;
      // HACK: hardcoding until checkTerritory API is accessible
      Client.emit('valid territory', addy.zip);

      // var msg,
      //     data,
      //     response = {};

      // data = 'zip=' + zip.toString();
      // console.log('data is ' + data);

      // if (zip !== null) {
      //   $.ajax({
      //     url: '//scexchange.solarcity.com/scfilefactory/app_handler/checkTerritory.ashx',
      //     // url: '//slc3web00.solarcity.com/scexchange/app_handler/checkTerritory.ashx',
      //     type: 'POST',
      //     data: data,
      //     dataType: 'json',
      //     error: function(err){
      //       response.is = false;
      //       response.msg = 'API not reachable';
      //       Client.emit('valid territory', response);
      //     },
      //     success: function(data) {
      //       // data = {'InTerritory' : 'false/true'}
      //       // console.log(typeof data)
      //      // console.log(data)
      //      Client.emit('valid territory', data.InTerritory);
      //     }
      //   });
      // }
    }

    function geocode_builder_brah () {
      return {
        addy: addy,
        sendGeocodeRequest: sendGeocodeRequest,
        checkTerritory: checkTerritory,
      };
    }

    // always save your firebase references when you create them
    return new geocode_builder_brah();
  } ];
}
