/* =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-

  OverView Controller

  Controls the views of shared proposal

=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=- */

controllers.controller('OverViewCtrl', ['Clientstream', 'defaultValues', '$stateParams', 'Proposal', 'FIREBASE_URL', OverViewCtrl_]);

function OverViewCtrl_ (Client, defaultValues, $stateParams, Proposal, FIREBASE_URL) {

var vm = this;
var i = 1;
var localdata = [];

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

  /* temporarily point to production per TB's request */
      //var ref = new Firebase(FIREBASE_URL).child('designs');
      var ref = new Firebase('https://scty-prod.firebaseio.com').child('designs');
      var data;

       ref.limitToLast(10).on('child_changed', function (ds) {
        data = ds.exportVal();
        if(data.areas != null)
        {
          if(data.areas[0].ridge != null) 
          {
            if(data.areas[0].tilt != null)
            {

              localdata[i] = data;
              var pmap = new google.maps.Map(document.getElementById('gmap'+i), map_options);
              document.getElementById('gmap'+i).removeEventListener('click')
              google.maps.event.addDomListener(document.getElementById('gmap'+i), 'click', showPrompt);


              var listener = google.maps.event.addListener(pmap, "idle", function() { 
                pmap.setZoom(20); 
                google.maps.event.removeListener(listener); 
              });

              function showPrompt() {
                mydata = localdata[parseInt(this.id.replace('gmap', ''))]
                        var prompt_string = [mydata.areas[0].wkt ,
                             ' lat:' ,
                             mydata.map_details.center.lat ,
                             ' lng:' ,
                             mydata.map_details.center.lng ,
                             ' tilt:' ,
                             mydata.areas[0].tilt ,
                             ' ridge:' ,
                             mydata.areas[0].ridge[0] ,
                             ' ' ,
                             mydata.areas[0].ridge[1]].join(' ');
                        prompt("Copy to clipboard: Ctrl+C, Enter", prompt_string );
              };
              Proposal.setTargetOverView(data, pmap, i);    
              i++;
              if(i == 7)
              {
                i = 1;
              }
            }
          }
        }
      });
}
