directives.directive("ngModelOnBlur", [ngModelOnBlur_]);

function ngModelOnBlur_ () {
  return {
    restrict: 'A',
    require: 'ngModel',
    priority: 1, // needed for angular 1.2.x
    link: function(scope, element, attr, ngModelCtrl) {
      console.log('saving validation till blur on that input boss', element);
      if (attr.type === 'radio' || attr.type === 'checkbox') return;

      element.unbind('input').unbind('keydown').unbind('change');
      element.bind('blur', function() {
          scope.$apply(function() {
              ngModelCtrl.$setViewValue(element.val());
          });
      });
    }
  };
}
