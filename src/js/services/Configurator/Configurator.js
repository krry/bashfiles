/*
 * this is the Configurator for the map.
 * name: Configurator
 *

    inject it as you deem necessary... necessarily.
 *
 */

angular.module('flannel').service('newConfigurator', ['Clientstream','View', 'Interactions', 'Layers', newConfigurator_]);

function newConfigurator_(Client, View, Interactions, Layers) {
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
    layers: Layers.array,
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

  // View subscriptions
  function subGoogleMapToViewCenter() {
    var center = View.getCenter();
    gmap.setCenter(new google.maps.LatLng(center[1], center[0]));
  }

  function subGoogleMapToViewZoomLevel(e) {
    gmap.setZoom(View.getZoom());
  }

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

    // subscribe google's zoom and center to OL View's resolution & center
    View.rx_center.subscribe(subGoogleMapToViewCenter)
    View.rx_zoom.subscribe(subGoogleMapToViewZoomLevel);

    this.map = {
      omap: omap,
      gmap: gmap,
    }
    maps = this.map; // HACK... this shouldn't be public. only here for testing

    gmap.addListener('projection_changed', function(){
      // TODO: be prepared to fix projection of OLmap for zoom < 17 (currently disallowed by map_options)
      // the proj_changed, now fix the projection of the layers
      gmap_projection = gmap.getProjection();
      // resize the target element
      google.maps.event.trigger(gmap, 'resize');
      omap.updateSize();
    });

    Client.emit('Configurator: target set');
  }

  /* Interaction handlers */
  // Configurator is responsible for orchestrating the layers and interactions
  // it is not responsible for managing the Area polygons.6

  this.drawAdd = function () {
    omap.addInteraction(Interactions.draw);
    omap.addLayer(Layers.draw);
  }
  this.drawDel = function () {
    omap.removeInteraction(Interactions.draw);
  }
  this.modifyAdd = function () {
    omap.removeLayer(Layers.draw);
    omap.addLayer(Layers.modify);
    omap.addInteraction(Interactions.modify);
  }
  this.modifyDel = function () {
    omap.removeInteraction(Interactions.modify);
    omap.removeLayer(Layers.modify);
    omap.addLayer(Layers.draw);
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
    Interactions.modify.clearArea();
  }
}
