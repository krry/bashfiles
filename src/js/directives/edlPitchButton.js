function edlPitchButton(){
  return {
    restrict: "E",
    scope: {
      pitch: "=",
    },
    link: function(scope, ele, attr){
       
    },
    template: [
      '<div class="edloutter">',
        '<div class="edltext">{{pitch}}&deg','</div>',
        '<div class="edlupper" style="-webkit-transform: rotate({{pitch}}deg);">',
          '<div class="edlarc">',
            '<div class="edlcirclehole"></div>',
            '<div class="edlcirclering"></div>',
          '</div>',
          '<div class="edlanglebar"></div>',
        '</div>',
        '<div class="edllower">',
          '<div class="edlanglebar"></div>',
        '</div>',
      '</div>',
    ].join(' '),
  };
}
directives.directive('edlPitchButton', edlPitchButton);
