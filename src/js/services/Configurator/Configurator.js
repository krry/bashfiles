/*
 * this is the Configurator for the map.
 * name: Configurator
 *

    inject it as you deem necessary... necessarily.
 *
 */

angular.module('flannel').service('newConfigurator', ['$q', 'Clientstream', 'Design', 'View', 'Interactions', 'Layers', 'MapFactory', newConfigurator_]);

function newConfigurator_($q, Client, Design, View, Interactions, Layers, MapFactory) {
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
    mapTypeId: google.maps.MapTypeId.HYBRID,
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
    layers: Layers.collection,
    interactions: Interactions.collection,
    controls:  omap_controls,
    overlays: Layers.overlay_collection,
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

  function setTargetOfMaps(g_div, o_div) {
    // two target divs for the olmap and googlemap
    // TODO: use a directive or link function to select the elements
    // DOM selection or manipulation should not occur in a service

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
    View.rx_center.subscribe(subGoogleMapToViewCenter);
    View.rx_zoom.subscribe(subGoogleMapToViewZoomLevel);

    this.map = {
      omap: omap,
      gmap: gmap,
    }
    maps = this.map; // HACK... this doesn't need to be public. only here for testing.

    gmap.addListener('projection_changed', function(){
      // TODO: be prepared to fix projection of OLmap for zoom < 17 (currently disallowed by map_options)
      // the proj_changed, now fix the projection of the layers
      gmap_projection = gmap.getProjection();
      // resize the target element
      google.maps.event.trigger(gmap, 'resize');
      omap.updateSize();
    });

    maps.omap.on('change:size', function() {
      // resize the target element
      google.maps.event.trigger(gmap, 'resize');

    })

    maps.omap.updateSize();
    Client.emit('Configurator: update mapsize', maps.gmap)
    Client.emit('Configurator: target set');
  }

  var result = $q.defer()
  Client.listen('Configurator: target set', function (argument) {
    result.resolve(omap);
  })

  this.configurator = function() {
    return result.promise
  }

  /* Interaction handlers */
  // Configurator is responsible for orchestrating the layers and interactions
  // it is not responsible for managing the Area polygons.6

  this.drawAdd = function () {
    result.promise.then(function (map) {
      Client.emit('Configurator: update mapsize', map);

      // HACK: see FLNL-610. this prevents an issue where a user on a touch enabled device
      // would begin drawing a polygon immediately after centering their design and moving
      // to the drawstate. the touchend event was propagating through to the map viewport.
      // there's a known issue with angular that is related. we can also change the mobile
      // layout to solve this issue.
      var tempStopGapForTouchendBugHack = null;
      $(maps.omap.getViewport()).on('touchend', function (e) {
        if (tempStopGapForTouchendBugHack === null) {
          e.stopImmediatePropagation();
          tempStopGapForTouchendBug = 'butts';
        }
      });

    });
    Layers.collection.push(Layers.draw);
    Interactions.collection.push(Interactions.draw);
    if (typeof maps !== 'undefined') { if ( maps.omap) {maps.omap.updateSize()}}
  }
  this.drawDel = function () {
    Layers.collection.remove(Layers.draw);
    Interactions.collection.remove(Interactions.draw);
    if (typeof maps !== 'undefined') { if ( maps.omap) {maps.omap.updateSize()}}
  }
  this.modifyAdd = function () {
    result.promise.then(function (map) {
      Client.emit('Configurator: update mapsize', map)
    })

    // Layers.collection.remove(Layers.draw);
    Layers.collection.push(Layers.modify);
    Interactions.collection.push(Interactions.modify);
    result.promise.then(function (map) {
      map.updateSize()
      Interactions.modify_overlay.setMap(maps.omap);
    })
    // if (typeof maps !== 'undefined') { if ( maps.omap) {
    //   maps.omap.updateSize()
    // }}
  }
  this.modifyDel = function () {
    Interactions.collection.remove(Interactions.modify);
    Layers.collection.remove(Layers.modify);
    Interactions.modify_overlay.setMap(null)

    if (typeof maps !== 'undefined') { if ( maps.omap) {
      maps.omap.updateSize()
    }}
  }
  this.dragpanAdd = function () {
    result.promise.then(function (map) {
      Client.emit('Configurator: update mapsize', map);
    })

    Interactions.collection.push(Interactions.dragpan);
    if (typeof maps !== 'undefined') { if ( maps.omap) {maps.omap.updateSize()}}
  }
  this.dragpanDel = function () {
    Interactions.collection.remove(Interactions.dragpan);
    if (typeof maps !== 'undefined') { if ( maps.omap) {maps.omap.updateSize()}}
  }
  this.zoomAdd = function () {
    result.promise.then(function (map) {
      Client.emit('Configurator: update mapsize', map)
    })

    Interactions.collection.push(Interactions.zoom);
    if (typeof maps !== 'undefined') { if ( maps.omap) {maps.omap.updateSize()}}
  }
  this.zoomDel = function () {
    Interactions.collection.remove(Interactions.zoom);
    if (typeof maps !== 'undefined') { if ( maps.omap) {maps.omap.updateSize()}}
  }
  this.redoArea = function() {

    Interactions.modify.clearArea();
    if (typeof maps !== 'undefined') { if ( maps.omap) {maps.omap.updateSize()}}
  }
  this.roofpeakAdd = function() {
    result.promise.then(function (map) {
      Client.emit('Configurator: update mapsize', map)
      map.updateSize()
      // add the layer
      // map.addLayer(Layers.roofpeak)
      Layers.collection.push(Layers.roofpeak)
      // add the overlay
      // Layers.roofpeak_overlay.setMap(maps.omap)
      maps.omap.addOverlay(Layers.roofpeak_overlay);
    })
    if (typeof maps !== 'undefined') { if ( maps.omap) {
      maps.omap.updateSize()
    }}
  }
  this.roofpeakDel = function() {
    result.promise.then(function (map) {
      map.updateSize();
      // remove the layer
      // map.removeLayer(Layers.roofpeak);
      Layers.collection.remove(Layers.roofpeak);
      // remove the map from the overlay... seems weird, but necessary
      Layers.roofpeak_overlay.setMap(null);
    })
  }
}
