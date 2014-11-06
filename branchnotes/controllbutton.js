/* *********************

directives/controlbutton

  http://openlayers.org/en/v3.0.0/apidoc/ol.control.Control.html


  buttons should
    register themselves with their map
    know their interaction type and (value) [ pan(u,d,r,l), zoom(in/out), feature(add/remove) ]

  create and control visible widgets

  Where do we make a list of these interactions?

    crosshairs

    zoom-in
    zoom-out
    zoom-pan-left
    zoom-pan-right
    zoom-pan-up
    zoom-pan-down

    area-destroy
    area-add

******************** */


  // example:
  //   <div fln-interaction name=""/>

return {
  templateUrl: templateUrl,
  scope: {
    name: "=",
  },
  link: function linkButton(scope, element, attr) {
    // dev
    console.log('registering control button:',scope.name);

    // register self with map
    var control = ControlService.getByName(scope.name);
    var map     = MapService.getById(scope.mapId);
    map.addControl(control);

    element.$on('$destroy', function destroyElement() {
      map.removeControl(control);
    })

  },


/*
  /* pay attention to when there are panels present so the preview button can be styled: 
      this gives us scope.previewPanels -> plan.previewPanels
      there's an ng-class on the previewbutton looking for plan.previewPanels
  */
  /*

  Ol.panels.on('change', function panels(event) {
    var features = event.target.getFeatures();
    scope.previewPanels = features;
  });

      Ol.hideLayers = new ol.layer.Group({
        layers: new ol.Collection([mountLayer, obstructionLayer, gutterLayer])
      });
*/
