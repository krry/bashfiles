directives.directive("ngModelOnBlur", ["ngModel", ngModelOnBlur_]);

function ngModelOnBlur_ (ngModel) {
  return {
    priority: 1,
    restrict: 'A',
    require: 'ngModel',
    link: function(scope, elm, attr, ngModelCtrl) {
      if (attr.type === 'radio' || attr.type === 'checkbox') return;
      elm.off('input keydown change');
      elm.on('blur', function() {
        scope.$apply(function() {
          ngModelCtrl.$setViewValue(elm.val());
        });
      });
    }
  };
}
