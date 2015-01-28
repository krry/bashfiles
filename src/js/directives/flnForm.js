directives.directive('flnForm', flnForm);

function flnForm () {
  return {
    restrict: "A",
    controller: 'FormCtrl',
    controllerAs: 'form',
    link: function (scope, el) {
      // TODO: move this autofocus function into input directives
      // var inputToFocus = $(el).find('input[focus="true"]');
      // console.log('would auto focus', el);
      // if (inputToFocus.length > 0) {
      //   console.log('focusing:', inputToFocus);
      //   inputToFocus.focus();
      // }
    }
  };
}
