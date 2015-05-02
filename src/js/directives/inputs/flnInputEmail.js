directives.directive('flnInputEmail', [flnInputEmail_]);

function flnInputEmail_ () {
  return {
    restrict: "E",
    templateUrl: "templates/directives/inputs/flnInputEmail.html",
    require: '^flnForm',
  };
}
