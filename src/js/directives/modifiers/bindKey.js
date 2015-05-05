directives.directive('bindKey', ['keyCodes', bindKey_]);

function bindKey_ (keyCodes) {
  return {
    link: function (scope, element, attrs) {

      var bindings = map(scope.$eval(attrs.bindKey));

      element.on('focus', function() {
        element.bind('keypress', wireKeyToInput);
      });

      element.on('blur', function(){
        element.unbind('keypress', wireKeyToInput);
      });

      function map (obj) {
        var mapped,
            action;

        mapped = {};

        for (var key in obj) {
          if (keyCodes.hasOwnProperty(key)) {
            action = obj[key];
            mapped[keyCodes[key]] = action;
          }
        }
        return mapped;
      }

      function wireKeyToInput (event) {
        // console.log('bindings has: ', event.which);
        if (bindings.hasOwnProperty(event.which)) {
          // console.log('enter hit on input');
          scope.$apply(function () {
            scope.$eval(bindings[event.which]);
          });
          event.preventDefault();
        }
      }
    }
  };
}
