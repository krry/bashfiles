directives.directive('flnInputZip', ["Form", flnInputZip_]);

function flnInputZip_ (Form) {
  return {
    restrict: "E",
    replace: true,
    templateUrl: "templates/directives/flnInputZip.html",
    controller: function ($scope, $element, $attrs) {
      console.log('zip on dat DOM tip');
      console.log(Form);
    }
  };
}
