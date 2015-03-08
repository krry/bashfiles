angular.module('stages',[
  'flannel.providers',
  'design_link',
  'home',
  'configure',
  'proposal',
  'signup',
])
.config(["$locationProvider", "$stateProvider", "$urlRouterProvider", function ($locationProvider, $stateProvider, $urlRouterProvider) {
  // $urlRouterProvider.otherwise('/my-home'); // if users arrive somewhere other than the root URL, send them to the root.
  $stateProvider.state('flannel', {
    url: "/",
    abstract: true,
    views: {
      'header@': {
        templateUrl: 'templates/header.html',
        controller: 'NavCtrl as nav',
      },
      'footer@': {
        templateUrl: 'templates/footer.html',
        controller: 'FooterCtrl as footer',
      },
    }
  })

}]).run([function ui_router_run() {
  // this runs after all the dependencies are bootstrapped
}]);


directives.directive('flnTestMap', ['Clientstream', flnTestMap_]);

function flnTestMap_ (Client) {
  return {
    restrict: "A",
    templateUrl: 'templates/directives/test/flnTest.html',
    link: function flnTestMapLink(scope, ele, attrs) {
      // debugger;
      // var gmap = new google.maps.Map(document.getElementById('gmtest'), {
      //   disableDefaultUI: true,
      //   keyboardShortcuts: false,
      //   draggable: false,
      //   disableDoubleClickZoom: true,
      //   scrollwheel: false,
      //   streetViewControl: false
      // });
      //
      // var view = new ol.View({
      //   // make sure the view doesn't go beyond the 22 zoom levels of Google Maps
      //   maxZoom: 21
      // });
      //
      // view.on('change:center', function() {
      //   var center = ol.proj.transform(view.getCenter(), 'EPSG:3857', 'EPSG:4326');
      //   gmap.setCenter(new google.maps.LatLng(center[1], center[0]));
      // });
      // view.on('change:resolution', function() {
      //   gmap.setZoom(view.getZoom());
      // });
      // console.log('butts');
      // var olMapDiv = document.getElementById('oltest');
      // var map = new ol.Map({
      //   // layers: [vector],
      //   interactions: ol.interaction.defaults({
      //     altShiftDragRotate: false,
      //     dragPan: false,
      //     rotate: false
      //   }).extend([new ol.interaction.DragPan({kinetic: null})]),
      //   target: olMapDiv,
      //   view: view
      // });
      // view.setCenter([0, 0]);
      // view.setZoom(1);
      //
      // olMapDiv.parentNode.removeChild(olMapDiv);
      // gmap.controls[google.maps.ControlPosition.TOP_LEFT].push(olMapDiv);
    },
    controller: testCtrl,
  };
}






function testCtrl($scope, $element, $attrs) {
  // debugger;
  var gmap = new google.maps.Map(document.getElementById('gmtest'), {
    disableDefaultUI: true,
    keyboardShortcuts: false,
    draggable: false,
    mapTypeId: google.maps.MapTypeId.SATELLITE,
    disableDoubleClickZoom: true,
    scrollwheel: false,
    streetViewControl: false
  });

  var view = new ol.View({
    // make sure the view doesn't go beyond the 22 zoom levels of Google Maps
    maxZoom: 20,
  });

  view.on('change:center', function() {
    var center = ol.proj.transform(view.getCenter(), 'EPSG:3857', 'EPSG:4326');
    gmap.setCenter(new google.maps.LatLng(center[1], center[0]));
    console.log('center of gmap: ', gmap.getCenter());
    console.log('center of omap:', center);
  });
  view.on('change:resolution', function() {
    gmap.setZoom(view.getZoom());
    console.log('zoom of gmap:', gmap.getZoom());
    console.log('zoom of omap:', view.getZoom());
  });

  // var vector = new ol.layer.Vector({
  //   source: new ol.source.GeoJSON({
  //     url: 'data/geojson/countries.geojson',
  //     projection: 'EPSG:3857'
  //   }),
  //   style: new ol.style.Style({
  //     fill: new ol.style.Fill({
  //       color: 'rgba(255, 255, 255, 0.6)'
  //     }),
  //     stroke: new ol.style.Stroke({
  //       color: '#319FD3',
  //       width: 1
  //     })
  //   })
  // });

  var olMapDiv = document.getElementById('oltest');
  var map = new ol.Map({
    // layers: [vector],
    layers: [],
    interactions: ol.interaction.defaults({
      altShiftDragRotate: false,
      dragPan: false,
      rotate: false
    }).extend([new ol.interaction.DragPan({kinetic: null})]),
    target: olMapDiv,
    view: view
  });
  view.setCenter([0, 0]);
  view.setZoom(1);

  Configurator.setTarget();

  olMapDiv.parentNode.removeChild(olMapDiv);
  gmap.controls[google.maps.ControlPosition.TOP_LEFT].push(olMapDiv);

      console.log(' ************************ center of gmap: ', gmap.getCenter());
      console.log(' ************************ center of omap:', map.getView().getCenter());
}
