directives.directive('flnInputPets', [flnInputPets_]);

function flnInputPets_ () {
  return {
    restrict: "E",
    templateUrl: "templates/directives/inputs/flnInputPets.html",
    require: '^flnForm',
  };
}
