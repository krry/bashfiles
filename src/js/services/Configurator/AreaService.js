/*
 * this service is used to make features consistently in touch with Firebase
 *
  inject it as you deem necessary... necessarily.
 *
 */

angular.module('flannel').service('AreaService', ['Design', AreaService_]);

function AreaService_(Design) {
  var wkt = new ol.format.WKT();

  function featFromTxt (wkt_txt, style_param) {
    var feature = wkt.readFeature(wkt_txt);
    var geometry = wkt.readGeometry(wkt_txt);
    feature.set(style_param, geometry);
    feature.setGeometryName(style_param);
    return feature;
  }

  function getWkt(f) {
    return wkt.writeGeometry(f.getGeometry());
  }

  function getGeom(txt) {
    return wkt.readGeometry(txt);
  }

  this.wireUp = function(id, feature) {
    // var feature = featFromTxt(wkt, 'area');
    id = id || 0;
    feature.setId(id);
    feature.set('wkt', getWkt(feature));
    feature.on('change:wkt', function (evt) {
      Design.busy = true;
      Design.ref()
        .child('areas/0')
        .set({wkt: feature.get('wkt')});
    })
    feature.getGeometry().on('change', function (g) {
      feature.set('wkt', getWkt(feature));
    });
    return feature
  }

  this.featFromTxt = featFromTxt;
  this.getWkt  = getWkt;
  this.getGeom = getGeom;
}
