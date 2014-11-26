// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
//
//  AUTO SIZE INPUT
//
//  a directive that manifests as an input that will
//  automatically resize to the width of its contents
//
//  based on this gist from @Zmaster:
//  https://gist.github.com/Zmaster/6923413
//
// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-


function autoSizeInput() {
  return {
    replace: true,
    transclude: 'element',
    scope: {
      value: '=inputValue'
    },
    templateUrl: 'templates/directives/autoSizeInput.html',
    link: function(scope, element, attrs) {
      // find the span wrapping the input within the directive
      var elSpan = element.find('span');
      // find the input element within the directive
      var elInput = element.find('input');
      // detect and cache the input's font-size within the viewport
      var fontSize = elInput.css('font-size');
      var fontSizeVal = parseInt(fontSize, 10);
      // set the font-size of the span to match the input's font-size
      elSpan.css('font-size', fontSize);
      // initialize the span to contain the contents of the input
      debugger;
      console.log(attrs);
      elSpan.html(elInput.val());
      elInput.css('width', fontSize);
      // watch the directive for changes to the 'value' parameter
      scope.$watch('value', function(value) {
        // check the font-size of the input and the wrapper
        // console.log('target font-size is: '     + fontSizeVal + "px");
        // console.log('font-size of input is: '   + elInput.css('font-size'));
        // console.log('font-size of span is: '    + elSpan.css('font-size'));
        // check width of the wrapper span
        // console.log('wrapper span width is: '   + elSpan[0].offsetWidth + "px");
        // compare the width of the input with the offsetWidth
        // console.log('input width is: '          + elInput.css('width'));
        // console.log('input offsetWidth is: '    + elInput[0].offsetWidth);
        // console.log('input width will become: ' + (elSpan[0].offsetWidth + fontSizeVal)+'px');
        if(value) {
          // check value of input and assign it to the span
          // console.log(elInput.val());
          elSpan.html(elInput.val());
          // set the width of the input to the offsetWidth of the span
          elInput.css('width', (elSpan[0].offsetWidth + fontSizeVal) + 'px');
        }
      });
    }
  };
}

directives.directive('autoSizeInput', autoSizeInput);
