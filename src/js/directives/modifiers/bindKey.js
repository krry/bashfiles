constants.constant('keyCodes', {
  esc: 27,
  space: 32,
  enter: 13,
  tab: 9,
  backspace: 8,
  shift: 16,
  ctrl: 17,
  alt: 18,
  capslock: 20
});

directives.directive('bindKey', ['keyCodes', bindKey_]);

function bindKey_ (keyCodes) {
  return {
    link: function (scope, element, attrs) {

      function map (obj) {
        var mapped = {};
        for (var key in obj) {
          if (keyCodes.hasOwnProperty(key)) {
            var action = obj[key];
            mapped[keyCodes[key]] = action;
          }
        }
        return mapped;
      }

      var bindings = map(scope.$eval(attrs.bindKey));
      if ($(element).focus()) {
        element.bind('keydown keypress', function (event) {
          if (bindings.hasOwnProperty(event.which)) {
            console.log('enter hit on input')
            scope.$apply(function () {
              scope.$eval(bindings[event.which]);
            });
            event.preventDefault();
          }
        });
      }
    }
  };
}
