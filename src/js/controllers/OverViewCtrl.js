/* =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-

  OverView Controller

  Controls the views of shared proposal

=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=- */

controllers.controller('OverViewCtrl', ['Clientstream', 'defaultValues', '$stateParams', 'Proposal', 'FIREBASE_URL', OverViewCtrl_]);

function OverViewCtrl_ (Client, defaultValues, $stateParams, Proposal, FIREBASE_URL) {

var vm = this;
var i = 1;

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

      var ref = new Firebase(FIREBASE_URL).child('designs');
      var data;

       ref.limitToLast(10).on('child_changed', function (ds) {
        data = ds.exportVal();
        if(data.areas != null && data.areas[0].ridge != null && data.areas[0].tilt != null)
        {
          var pmap = new google.maps.Map(document.getElementById('gmap'+i), map_options);
          google.maps.event.addDomListener(document.getElementById('gmap'+i), 'click', showPrompt);
          function showPrompt() {
            prompt("Copy to clipboard: Ctrl+C, Enter", data.areas[0].wkt + ' lat:' + data.map_details.center.lat + ' lng:' + data.map_details.center.lng + ' tilt:' + data.areas[0].tilt + ' ridge:' + data.areas[0].ridge[0] + ' ' + data.areas[0].ridge[1]);
          };
          Proposal.setTargetOverView(data, pmap, i);    
          i++;
          if(i == 7)
          {
            i = 1;
          }
        }
      });
}
