directives.directive('flnInputStreet', [flnInputStreet_]);

function flnInputStreet_ () {
  return {
    restrict: "E",
    templateUrl: "templates/directives/inputs/flnInputStreet.html",
    require: '^flnForm',
    link: function (scope, element, attrs, FormCtrl) {
      var elVal,
          form
      form = FormCtrl;
      element.focus();
      element.bind('blur change', function (){
        elVal = $(element).find('input').val();
        form.checkAddress(elVal);
      })
    },
  };
}
