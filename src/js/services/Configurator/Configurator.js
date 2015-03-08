/*
 * this is the Configurator for the map.
 * name: Configurator
 *

    inject it as you deem necessary... necessarily.
 *
 */

angular.module('flannel').service("newConfigurator", newConfigurator_);

function newConfigurator_() {

    this.setTarget = function (elem) {
      return this.map.setTarget(elem);
    }

    this.view = new ol.View({
      center: [0, 0],
      zoom: 1
    });

    this.map = new ol.Map({
      view: view,
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
