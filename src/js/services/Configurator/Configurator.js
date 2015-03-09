/*
 * this is the Configurator for the map.
 * name: Configurator
 *

    inject it as you deem necessary... necessarily.
 *
 */

angular.module('flannel').service("newConfigurator", ["View", newConfigurator_]);

function newConfigurator_(View) {
  var gmap,
      omap,
      // defaults
      gmap_options,
      omap_options;

  gmap_options = {
    disableDefaultUI: true,
    keyboardShortcuts: false,
    draggable: false,
    mapTypeId: google.maps.MapTypeId.SATELLITE,
    disableDoubleClickZoom: true,
    scrollwheel: false,
    streetViewControl: false
  };

  omap_options = {
    layers: [], // layers: [vector],
    interactions: ol.interaction.defaults({
      altShiftDragRotate: false,
      dragPan: false,
      rotate: false
    }).extend([new ol.interaction.DragPan({kinetic: null})]),
    view: View
  }

  this.setTarget = function (elem) {
    var g_div, o_div;
    // two target divs for the olmap and googlemap
    g_div = $(elem).find('#gmtest')[0];
    o_div = $(elem).find('#oltest')[0];

    // create the maps
    gmap = new google.maps.Map(g_div, gmap_options);
    omap = new ol.Map(omap_options);
    // set the target of the openlayers map
    omap.setTarget(o_div);

    View.setCenter([0, 0]);
    View.setZoom(1);

    o_div.parentNode.removeChild(o_div);
    gmap.controls[google.maps.ControlPosition.TOP_LEFT].push(o_div);

    this.map = {
      omap: omap,
      gmap: gmap, 
    }

    return {
      omap: o_div,
      gmap: g_div,
    };
  }


  // map
  this.map = {
    omap: (omap),
    gmap: (gmap),
  };

  View.on('change:center', function() {
    var center = ol.proj.transform(View.getCenter(), 'EPSG:3857', 'EPSG:4326');
    gmap.setCenter(new google.maps.LatLng(center[1], center[0]));
    console.log('center of gmap: ', gmap.getCenter());
    console.log('center of omap:', center);
  });

  View.on('change:resolution', function() {
    gmap.setZoom(View.getZoom());
    console.log('zoom of gmap:', gmap.getZoom());
    console.log('zoom of omap:', View.getZoom());
  });



  /* interactions */
  // draw
    // add
      // return map.addInteraction()
    // remove
  // modify
    // add
      // draw.onNext('add');
    // remove
      // modify.onNext('remove');
  // zoom
    // add
      // zoom.onNext('add', map);
    // remove
      // zoom.onNext('remove', map);
  // controls
    // add
      // controlls.onNext('add', map);
    // remove
      // controlls.onNext('remove', map);

}
