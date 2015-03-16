directives.directive('flnInputHoa', [flnInputHoa_]);

function flnInputHoa_ () {
  return {
    restrict: "E",
    templateUrl: "templates/directives/inputs/flnInputHoa.html",
    require: '^flnForm',
  };
}
