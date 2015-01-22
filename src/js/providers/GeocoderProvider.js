/* =========================================================

  GeocoderProvider

  provides a geocoder along with such services

  emits results to the Clientstream
  to which geocoding controllers listen

========================================================= */

providers.provider("Geocoder", [GeocoderProvider_]);

function GeocoderProvider_ (UserService) {

  this.$get = [ "Clientstream", "UserService", function googleAddressProvider (Client) {

    var geocoder,
        addy;

    addy = {};

    // pack the request as a nice little object and send it off to geocode camp
    function sendGeocodeRequest (request) {
      var addyStr,
          gecoder,
          components;

      addyStr = "";

      if (typeof request === "string") {
        addyStr = request;
      }
      else {
        for (var key in request) {
          if (request.hasOwnProperty(key)){
            console.log("appending", key,"to addy string");
            if (addyStr.length === 0) {
              addyStr = request[key];
            } else {
              addyStr = addyStr + " " + request[key];
            }
            // components[key] = request[key];
          }
        }
      }

      geocoder = new google.maps.Geocoder();
      // components = { "country": "US" };

      addy = {
        "address": addyStr,
        // "componentRestrictions": components,
      };

      geocoder.geocode(addy, handleGeocodeResults);
    }

    // handle geocode errors, and if successful save and use the results
    function handleGeocodeResults(results, status) {
      var center;
      console.log('geocode results received', results);
      if (status === google.maps.GeocoderStatus.OK) {
        if (results[0]) {

          console.log('geocode successful:', results);
          center = results[0].geometry.location;
          console.log('center plotted at:', center);
          addy = parseLocation(results[0]);
          console.log('addy parsed into:', addy);

          Client.emit('geocode results', center);
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
      var addy,
          parsedress,
          response;

      addy = {};
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
        if (addy.zip) {
          Client.emit('valid zip', addy.zip)
          checkTerritory(addy.zip);
        }
        if (addy.state) {
          Client.emit('valid state', addy.state);
        }
        if (addy.city) {
          Client.emit('valid city', addy.city);
        }
        if (addy.street) {
          Client.emit('valid address', addy);
          if (addy.stno) {
            addy.home = addy.stno + " " + addy.street;
            Client.emit('valid house', addy.home);
          }
        }
      }
    }

    function checkTerritory(zip) {
      console.log('checking if', zip, 'is in our territory');

      var msg,
          data,
          response = {};

      data = 'zip=' + zip.toString();
      console.log('data is ' + data);

      if (zip !== null) {
        $.ajax({
          // url: '//scexchange.solarcity.com/scfilefactory/app_handler/checkTerritory.ashx',
          url: '//slc3web00.solarcity.com/scexchange/app_handler/checkTerritory.ashx',
          type: 'POST',
          data: data,
          dataType: 'json',
          error: function(err){
            response.is = false;
            response.msg = 'API not reachable';
            Client.emit('valid territory', response);
          },
          success: function(data) {
            // data = {'InTerritory' : 'false/true'}
            // console.log(typeof data)
           // console.log(data)
            response.is = data.InTerritory;
            response.msg = "It is " + data.InTerritory +" that this place is in SolarCity territory"; 
            Client.emit('valid territory', response);
          }
        });
      }
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
