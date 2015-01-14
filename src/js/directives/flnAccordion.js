directives.directive('flnAccordion', [flnAccordion]);

function flnAccordion () {
  return {
    restrict: 'EA',
    controller: 'AccordionCtrl',
    controllerAs: 'accordion',
  };
}
