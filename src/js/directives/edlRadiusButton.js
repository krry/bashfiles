function edlRadiusButton() {
  return {
    restrict: "E",
    link: function edlRadiusButtonLink(scope, elem, attr){
      elem.on('touchmove', function(e){e.preventDevault();});
    },
    template: [
      '<label id="obstruction-range-label">',
        '<div class="range range-assertive">',
          '<input type="range"',
            'id="obstruction-range-input"',
            'min="5"',
            'max="200"',
            'ng-change="focus.set(\'radius\', plan.radius)"',
            'ng-model="plan.radius"',
          '>',
        '</div>',
      '</label>',
    ].join(' '),
  };
}
directives.directive('edlRadiusButton', edlRadiusButton);
