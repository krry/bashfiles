function DetailCtrl_(OlService, MapService, ApiService, PanelFillService) {
  var vm = this;
  var Ol = OlService;

  vm.fillPanel = function fillPanel(feature) {
    var panelstoadd;
    if (feature !== null) {
        // if selected feature has panels, delete them
        var id = feature.getId();
        var panellayer = Ol.layers.panel;
        var existing = panellayer.getFeatureById(id);
        if (existing) {
            Ol.removeFeatureById(id, panellayer);
        }
        var msg = Ol.fillMessageForSingleMount(feature);
        // create api message with Process Features
        var api = PanelFillService.processFeatures(msg.m, msg.o);
        
        ApiService.uploadMounts(api) //TODO: change from sample
          .then(function (data) {
            panelstoadd = PanelFillService.makePanelsWithApiResponse(data, id);
            OlService.panels.addFeatures(panelstoadd);
            vm.mountPlanePopup(feature, panelstoadd);
        });

    }
  };

  vm.mountPlanePopup = function(mountplane, panels){
    var map = MapService.getOmap();

    if (mountplane.get('panelCount')) {
      map.removeOverlay(mountplane.get('popup'));
    }
    mountplane.set('panelCount', panels.length);
    var coord = mountplane.getGeometry().getFirstCoordinate();
    var element = angular.element([
        '<div ng-controller="PlanCtrl" id="popover">',
          '<div class="popover-content">Panel Count! ' + mountplane.get('panelCount') + '</div>',
          '<div class="popover-content">Savings </div>',
        '</div>',
      ].join(' '));

    var overlay = new ol.Overlay({
      element: element,
      positioning: 'top-center',
    });

    mountplane.set('popup', overlay);
    overlay.setPosition(coord);
  };
}

controllers.controller("DetailCtrl", DetailCtrl_);

