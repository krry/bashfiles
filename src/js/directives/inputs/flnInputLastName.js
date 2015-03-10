directives.directive('flnInputLastName', [flnInputLastName_]);

function flnInputLastName_ () {
  return {
    restrict: "E",
    templateUrl: "templates/directives/inputs/flnInputLastName.html",
    require: '^flnForm',
  };
}
