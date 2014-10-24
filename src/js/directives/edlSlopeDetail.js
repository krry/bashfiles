function edlSlopeDetail() {
  return {
    restrict: "E",
    transclude: true,
    link: function edlSlopeDetail(scope, ele, attr) {
      scope.slopes = ['45', '42.5','40','37','33.75','30.5','26.5','22.5','18.5','14','9.5','4.5'];
      scope.buttonsPerBar = 6;
      scope.bars  = [];
      var len = scope.slopes.length;
      var pos = 0;

      for (var i=0;i < len; i++){
        if( i % scope.buttonsPerBar === 0) {
          // make a new array for that row & set pos = 0
          scope.bars.push([]);
          pos = 0;
        }
        // push the button to the correct position in the bar
        scope.bars[scope.bars.length-1].push({
          slope: parseInt(scope.slopes[i]) // must be an integer, else input doesn't work
        });
        pos++;
      }
    },
    template: [
      '<label>',
        '<div id="right-side-slope-menu">',
          '<div  class="row" ng-repeat="bar in bars">',
            '<ion-radio',
                'type="radio"',
                'class="col" ',
                'ng-repeat="button in bar"',
                'ng-model="plan.pitch"',
                'ng-value="button.slope"',
                'ng-change="focus.set(\'pitch\',button.slope)"',
            '>',
              // '<div >',
                // '<edl-pitch-button pitch="plan.pitch"',
                //   'ng-repeat="button in bar"',
                // ' >',
                // '</edl-pitch-button>',
              // '</div>',
              '{{button.slope}}',
            '</ion-radio>',
          '</div >',
          '<span class="input-label">Slope</span>',
            '<div class="item item-input-inset">',
              '<div class="pitchbuttoncontainer" >',
                '<edl-pitch-button pitch="plan.pitch"></edl-pitch-button>',
              '</div>',
              '<label class="item-input-wrapper">',
                  '<input',
                    'type="number"',
                    'id="mountPitchInput"',
                    'placeholder="Slope"',
                    'required="true"',
                    'min="0"',
                    'max="89"',
                    'ng-change="focus.set(\'pitch\',plan.pitch)"',
                    'ng-model="plan.pitch"',
                    '>',
              '</label>',
            '</div>',
        '</div>',
      '</label>',
    ].join(' '),
  };
}
directives.directive('edlSlopeDetail', edlSlopeDetail);
