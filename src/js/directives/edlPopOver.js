function edlPopOver($ionicGesture) {
  return {
    restrict: "E",
    scope: {
      panelCount: "=",
      savings:    "=",
    },
    link: function edlPopOverLink(scope, ele, attr) {


    },
    template: [
      '<div id="popover" class="popover">',
        '<div class="popover__content">Panel Count! {{panelCount}}</div>',
        '<div class="popover__content">Part Deux {{savings}}</div>',
      '</div>',
    ].join(' '),
  };
}
directives.directive('edlPopOver', edlPopOver);
