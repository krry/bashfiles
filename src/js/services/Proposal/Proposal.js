/*
 * this is the Proposal view constructor for the map.
 * inject it as you deem necessary... necessarily.
 *
 */

angular.module('flannel').service('Proposal', [ 'Design', 'Panelfill', 'Clientstream', Proposal_]);
var map
function Proposal_(Design, Panelfill, Client) {
  // var map;
  // center = Design.map_details.center;
  var map_options = {
    zoom: 20,
    mapTypeId: google.maps.MapTypeId.SATELLITE,
    disableDoubleClickZoom: true,
    scrollwheel: true,
    streetViewControl: false,
    disableDefaultUI: true,
    keyboardShortcuts: false,
    draggable: false,
  };

  // var _ref = new Firebase('https://scty.firebaseio.com/designs/butts')
  Design.ref().child('areas/0/wkt').once('value', function (ds) {
    var wkt_txt = ds.exportVal();
    console.log('wkt_txt in design', wkt_txt)
    Panelfill.getFilled(wkt_txt)
    .then(processTwoDArray);
  })

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
      debugger;
      map.setCenter(bounds.getCenter());
      p_array.forEach(function(polygon){
        polygon.setMap(map);
      })
    })
  }
}


/*
  var gmap,
      omap,
      // defaults
      gmap_options,
      omap_options,
      omap_controls,
      // follow this to make sure we're converting properly
      gmap_projection;

  gmap_options = {
    disableDefaultUI: true,
    keyboardShortcuts: false,
    draggable: false,
    mapTypeId: google.maps.MapTypeId.SATELLITE,
    disableDoubleClickZoom: true,
    scrollwheel: false,
    streetViewControl: false
  };

  omap_controls = [];



  omap_options = {
    layers: [],
    controls:  [],
    interactions: [],
  }

  // startup the map inside the DOM
  this.setTarget = setTargetOfMaps;

  // maps (defined by #setTargetOfMaps);
  this.map = {
    omap: omap,
    gmap: gmap,
  };


  var area_ref = new Firebase('https://scty.firebaseio.com/designs/butts/areas/0')

  area_ref.once('value', function (ds) {
    area_wkt = ds.exportVal().wkt;
    Panelfill.getFilled(area_wkt).then(function handlePanelfillFeatures(f_array) {
      // chain calls to fulfill

      // style feature array
      // add feature array to source
      // get extent of source
      // set gmap extent with source extent
      // set omap extent with source extent
    })
  });





  function setTargetOfMaps(elem) {
    console.debug('Configurator.setTarget(elem) => elem: ', elem);
    var g_div, o_div;
    // two target divs for the olmap and googlemap
    // TODO: use a directive or link function to select the elements
    // DOM selection or manipulation should not occur in a service
    g_div = $(elem).find('#gmtest')[0];
    o_div = $(elem).find('#oltest')[0];
    // create the maps
    gmap = new google.maps.Map(g_div, gmap_options);
    omap = new ol.Map(omap_options);

    view = new ol.View({
      center: Design.map_details.center,
      projection: 'EPSG:4326',
    });

    // set the omap view
    omap.setView(view);
    // set the target of the openlayers map
    omap.setTarget(o_div);
    // shove OL map into Google's ControlPosition div
    o_div.parentNode.removeChild(o_div);
    gmap.controls[google.maps.ControlPosition.TOP_LEFT].push(o_div);

    // initialize the map
    this.map = {
      omap: omap,
      gmap: gmap,
    }
    // TODO: be prepared to fix projection of OLmap for zoom < 17 (currently disallowed by map_options)
    gmap.addListener('projection_changed', function(){
      // the proj_changed, now fix the projection of the layers
      gmap_projection = gmap.getProjection();
      // resize the target element
      omap.updateSize();
      google.maps.event.trigger(gmap, 'resize');
    });
  }
*/
