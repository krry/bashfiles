/*
 * this is the Configurator for the map.
 * name: Configurator
 *

    inject it as you deem necessary... necessarily.
 *
 */

angular.module('flannel').service("newConfigurator", newConfigurator_);

function newConfigurator_() {

    var extent = [0, 0, 1024, 968];
    var projection = new ol.proj.Projection({
      code: 'xkcd-image',
      units: 'pixels',
      extent: extent
    });

    this.setTarget = function (elem) {
      return this.map.setTarget(elem);
    }

    this.view = new ol.View({
      center: [0, 0],
      zoom: 1,
      projection: projection,
      center: ol.extent.getCenter(extent),
    });

    this.map = new ol.Map({
      view: this.view,

      layers: [
    new ol.layer.Image({
      source: new ol.source.ImageStatic({
        attributions: [
          new ol.Attribution({
            html: '&copy; <a href="http://xkcd.com/license.html">xkcd</a>'
          })
        ],
        url: 'http://imgs.xkcd.com/comics/online_communities.png',
        imageExtent: extent,
        imageSize:  [1024, 968],
        projection: projection,
      })
    })
  ],
    });




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

    // map




}
