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
            console.log('enter hit on input');
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
