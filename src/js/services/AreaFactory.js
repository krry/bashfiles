/**
 * this is an object
 * name: fln_area
 *
 * @requires $injector
 *
 * @description
 * Service. Manages loading of templates.
 */
AreaFactory_.$inject = [];
function AreaFactory_( ) {

  var map = new ol.map();

  this.setOriginMap = function setOriginMap (origin_map) {
    // tie the features of the original map to the new map
  }

  this.setCenter = function setCenter (new_center) {
    // set the center of the map
  }

  this.setArea = function setArea (feature) {
    // add feature to map
  }


}

angular.module('flannel').factory('AreaFactory', AreaFactory_);
angular.module('flannel').factory('MapService', ['$q', 'LayerService', MapService_]);
