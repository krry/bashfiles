/*
 * this is the Proposal view constructor for the map.
 * inject it as you deem necessary... necessarily.
 *
 */

angular.module('flannel').service('Proposal', [ 'Session', 'Panelfill', 'Clientstream', Proposal_]);
var map
function Proposal_(Session, Panelfill, Client) {
  // var map;
  // center = Design.map_details.center;
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

  // var _ref = new Firebase('https://scty.firebaseio.com/designs/butts')
  Session.ref().parent().parent().child('designs')
    .child(Session.ref().key()).child('areas/0/wkt')
      .once('value', function (ds) {
      var wkt_txt = ds.exportVal();
      console.log('wkt_txt in design', wkt_txt)
      Panelfill.getFilled(wkt_txt)
      .then(processTwoDArray);
  });

  var panels_array;

  function processTwoDArray(data) {
    // data = data.slice(230) // hack;
    panels_array = []
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
      strokeColor: '#FF0000',
      strokeOpacity: 0.8,
      strokeWeight: 3,
      fillColor: '#FF0000',
      fillOpacity: 0.35,
    });
  }

  this.setTarget = function setTarget(element) {
    map = new google.maps.Map(document.getElementById('gmap'), map_options);
    var bounds = new google.maps.LatLngBounds()
    Client.listen('panelfill', function function_name(p_array) {
      // for the map boundaries
      p_array.forEach(maxBounds);
      function maxBounds(polygon){
        var point_array = polygon.getPath().getArray();
        point_array.forEach(compareAgainstMax);
      }
      function compareAgainstMax(pt){
        bounds.extend(pt);
      }
      map.setCenter(bounds.getCenter());
      p_array.forEach(function(polygon){
        polygon.setMap(map);
      })
    })
  }
}
