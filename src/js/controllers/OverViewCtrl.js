/* =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-

  OverView Controller

  Controls the views of shared proposal

=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=- */

controllers.controller('OverViewCtrl', ['Clientstream', 'defaultValues', '$stateParams', 'Proposal', 'FIREBASE_URL', OverViewCtrl_]);

function OverViewCtrl_ (Client, defaultValues, $stateParams, Proposal, FIREBASE_URL) {

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

  // var _ref = new Firebase(FIREBASE_URL).child('designs');
  /* temporarily point to production per TB's request */
  var _ref = new Firebase('https://scty-prod.firebaseio.com').child('designs');

  _ref.limitToLast(10).on('child_changed', function (ds) {
    var data, pmap;
    data = ds.exportVal();

    if (data.areas !== null && data.areas[0].ridge !== null && data.areas[0].tilt !== null) {
      pmap = new google.maps.Map(document.getElementById('gmap'+i), map_options);
      document.getElementById('gmap'+i).removeEventListener('click')
      google.maps.event.addDomListener(document.getElementById('gmap'+i), 'click', showPrompt);

      function showPrompt() {
        var prompt_string = [data.areas[0].wkt ,
                             ' lat:' ,
                             data.map_details.center.lat ,
                             ' lng:' ,
                             data.map_details.center.lng ,
                             ' tilt:' ,
                             data.areas[0].tilt ,
                             ' ridge:' ,
                             data.areas[0].ridge[0] ,
                             ' ' ,
                             data.areas[0].ridge[1]].join(' ');

        prompt("Copy to clipboard: Ctrl+C, Enter", prompt_string );
      };

      Proposal.setTargetOverView(data, pmap, i);

      // only allow 6 map divs on the page
      i++;
      if (i == 7) {
        i = 1;
      }
    }
  });
}
