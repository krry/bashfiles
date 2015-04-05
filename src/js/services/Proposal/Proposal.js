/*
 * this is the Proposal view constructor for the map.
 * inject it as you deem necessary... necessarily.
 *
 */

angular.module('flannel').service('Proposal', ['Session', 'Panelfill', 'Clientstream', Proposal_]);

var proposal_map;

function Proposal_(Session, Panelfill, Client) {
  // TODO: Revisit naming of this and Panelfill API service... to whatever it should be.
  var map_options = {
    zoom: 20,
    mapTypeId: google.maps.MapTypeId.SATELLITE,
    disableDoubleClickZoom: false,
    scrollwheel: false,
    streetViewControl: false,
    disableDefaultUI: true,
    keyboardShortcuts: false,
    draggable: false,
  };

  var savedMapTilt;

  function getStarted(design_id) {
    var ridge,
        lat,
        ridge_ref,
        ref;
    // TODO: convert to promise patern : jfl
    if (Session.ref()) {
      // typical use case for user in flow
      Session.ref().parent().parent().child('designs')
      .child(Session.ref().key())
      .once('value', function (ds) {
        var data = ds.exportVal();
        debugger;
        // console.log('wkt_txt in design', wkt_txt)
        Panelfill.getFilled(data.areas[0].wkt, data.areas[0].ridge, data.map_details.center.lat, data.areas[0].tilt)
        .then(processTwoDArray);
      });
    } else {
      // share proposal link
      ref = new Firebase('https://scty-int.firebaseio.com').child('designs')
        .child(design_id)
      ref.once('value', function (ds) {
        var data = ds.exportVal();
        Panelfill.getFilled(data.areas[0].wkt, data.areas[0].ridge, data.map_details.center.lat, data.areas[0].tilt)
        .then(processTwoDArray);
      });
    }
  }

  var panels_array;

  var rx_panel_count = new Rx.Subject();
  this.rx_panel_count = rx_panel_count;
  function processTwoDArray(data) {
    // data = data.slice(230) // hack;
    panels_array = [];
    for (var i = 0; i < data.length; i++) {
      panels_array.push(makePanel(data[i]));
    }
    Client.emit('panelfill', panels_array);
  }

  function makePanel(data) {
    var panel_coords = [];

    for (var j = 0; j < data.length; j++) {
      data[j].reverse();
      panel_coords.push(new google.maps.LatLng(data[j][0], data[j][1]));
    }
    return new google.maps.Polygon({
      paths: panel_coords,
      clickable: false,
      strokeColor: '#e7f3fc',
      strokeOpacity: 0.3,
      strokeWeight: 1,
      fillColor: '#000000',
      fillOpacity: 0.75,
    });

  }

  this.setTarget = function setTarget(design_id) {
    var tilt_ref

    // get the rx_s
    Session.rx_session()
    // set the proposal map center to the val on session
    .then(function makePanelfillMap (rx_s) {
      proposal_map = new google.maps.Map(document.getElementById('gmap'), map_options);
      proposal_map.setCenter(rx_s.value.map_center);
      return proposal_map;
    })
    .then(function () {
      getStarted(design_id);
    });

    Client.listen('panelfill', function function_name(p_array) {
        // for the map boundaries
      var bounds = new google.maps.LatLngBounds();

      // for the map boundaries
      p_array.forEach(maxBounds);

      function maxBounds(polygon){
        var point_array = polygon.getPath().getArray();
        point_array.forEach(compareAgainstMax);
      }

      function compareAgainstMax(pt){
        bounds.extend(pt);
      }

      proposal_map.setCenter(bounds.getCenter());

      p_array.forEach(function(polygon){
        polygon.setMap(proposal_map);
      });

      rx_panel_count.onNext(p_array.length);

    });

    // :::::::::::::: save for Mike  ::::::::::::::::
  // // default to 45, then look up the value in firebase if we have a record
  //   if (Session.ref()) {
  //     Session.ref().parent().parent().child('designs')
  //     .child(Session.ref().key()).child('areas/0/tilt')
  //       .once('value', function (ds) {
  //         savedMapTilt = ds.exportVal();
  //     });
  //   }  else  {
  //     tilt_ref = new Firebase('https://scty-int.firebaseio.com').child('designs')
  //     .child(design_id)
  //     // .child(Session.ref().key())
  //     .child('areas/0/tilt')
  //       .once('value', function (ds) {
  //           savedMapTilt = ds.exportVal();
  //     });
  //   }
  //   if (savedMapTilt || savedMapTilt == 0) {
  //     map_options.tilt = savedMapTilt;
  //   }
    // :::::::::::::: end of save for Mike  ::::::::::::::::

  }
}
