directives.directive('flnForm', flnForm);

function flnForm () {
  return {
    restrict: "A",
    controller: 'FormCtrl',
    controllerAs: 'form',
    link: function (scope, el) {
      var inputToFocus = $(el).find('input[focus="true"]');
      console.log('running form link function');
      if (inputToFocus.length > 0) {
        console.log('focusing:', inputToFocus);
        inputToFocus.focus();
      }
    }
  };
}
