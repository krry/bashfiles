directives.directive('flnInputZip', [flnInputZip_]);

function flnInputZip_ () {
  return {
    restrict: "E",
    templateUrl: "templates/directives/inputs/flnInputZip.html",
    require: '^flnForm',
    link: function (scope, element, attrs, FormCtrl) {
      var elVal,
          form;
      form = FormCtrl;
      element.bind('blur change', function () {
        elVal = $(element).find('input').val();
        if (form.prospect().zip !== elVal) form.checkZip(elVal);
      })
    },
  };
}
