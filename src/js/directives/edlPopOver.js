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
      '<div id="popover">',
        '<div class="popover-content">Panel Count! {{panelCount}}</div>',
        '<div class="popover-content">Part Deux {{savings}}</div>',
      '</div>',
    ].join(' '),
  };
}
directives.directive('edlPopOver', edlPopOver);
