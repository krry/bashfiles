directives.directive('flnInputEmail', [flnInputEmail_]);

function flnInputEmail_ () {
  return {
    restrict: "EA",
    templateUrl: "templates/directives/inputs/flnInputEmail.html",
    require: '^flnForm',
  };
}
