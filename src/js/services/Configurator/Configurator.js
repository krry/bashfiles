/*
 * this is the Configurator for the map.
 * name: Configurator
 *

    inject it as you deem necessary... necessarily.
 *
 */

angular.module('flannel').service('newConfigurator', ['View', 'Interactions', 'Layers', newConfigurator_]);

function newConfigurator_(View, Interactions, Layers) {
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

  omap_controls = ol.control.defaults({
    zoom: false,
    attribution: false,
    rotate: false,
  });

  omap_options = {
    layers: Layers,
    controls:  omap_controls,
    interactions: [],
    view: View
  }

  // startup the map inside the DOM
  this.setTarget = setTargetOfMaps;

  // maps (defined by #setTargetOfMaps);
  this.map = {
    omap: omap,
    gmap: gmap,
  };

  // subscribe google's zoom and center to OL View's resolution & center
  View.rx_center.subscribe(handleCenter)
  View.rx_zoom.subscribe(handleZoom);

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
    // set the target of the openlayers map
    omap.setTarget(o_div);
    // shove OL map into Google's ControlPosition div
    o_div.parentNode.removeChild(o_div);
    gmap.controls[google.maps.ControlPosition.TOP_LEFT].push(o_div);
    // initialize the map
    var center = View.getCenter();
    View.setCenter(center);
    View.setZoom(18);
    this.map = {
      omap: omap,
      gmap: gmap,
    }
    // TODO: be prepared to fix projection of OLmap for zoom < 17 (currently disallowed by map_options)
    gmap.addListener('projection_changed', function(){
      console.log('proj_changed, now fix the projection of the layers');
      gmap_projection = gmap.getProjection();
      // console.debug(gmap.getProjection());
      google.maps.event.trigger(gmap, 'resize');
      omap.updateSize();
    });
  }

  // View subscriptions
  function handleCenter(e) {
    var center = View.getCenter();
    gmap.setCenter(new google.maps.LatLng(center[1], center[0]));
    // console.debug('View:center', center);
    // console.debug('Google:center', gmap.getCenter());
  }

  function handleZoom(e) {
    gmap.setZoom(View.getZoom());
    // console.debug('View:resolution', View.getZoom());
    // console.debug('Google:zoom', gmap.getZoom());
  }

  /* Interaction handlers */
  this.drawAdd = function () {
    omap.addInteraction(Interactions.draw);
  }
  this.drawDel = function () {
    omap.removeInteraction(Interactions.draw);
  }
  this.modifyAdd = function () {
    Interactions.modify.getFeatureFromDraw();
    omap.addInteraction(Interactions.modify);
  }
  this.modifyDel = function () {
   Interactions.modify.clearFeaturesFromModify();
    omap.removeInteraction(Interactions.modify);
  }
  this.dragpanAdd = function () {
    omap.addInteraction(Interactions.dragpan);
  }
  this.dragpanDel = function () {
    omap.removeInteraction(Interactions.dragpan);
  }
  this.zoomAdd = function () {
    omap.addInteraction(Interactions.zoom);
  }
  this.zoomDel = function () {
    omap.removeInteraction(Interactions.zoom);
  }
  this.redoArea = function() {
    interactions.modify.clearArea();
  }
}
