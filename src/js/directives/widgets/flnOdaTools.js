directives.directive('flnOdaTools', [flnOdaTools_]);

function flnOdaTools_ () {
  return {
    templateUrl: 'templates/directives/widgets/flnOdaTools.html',
    controller: 'OdaCtrl',
    controllerAs: 'oda',
    link: function(scope, element, attrs) {
      scope.toggleUserObject = toggleUserObject;
      scope.toggleOdaPanel = toggleOdaPanel;
      scope.userShown = true;
      scope.userShownTriggerText = "hide";
      scope.odaPanelShown = false;
      scope.odaPanelShownTriggerText = "ODA";

      // TODO: register a oda tools service so directives outside the oda panel can interact with it. see the ModalService and ModalCtrl

      function toggleUserObject() {
        scope.userShown = !scope.userShown;
        scope.userShownTriggerText = (scope.userShown) ? "hide" : "show";
      }

      function toggleOdaPanel() {
        var trigger = $(element).find('.oda-trigger');
        scope.odaPanelShown = !scope.odaPanelShown;
        if (scope.odaPanelShown) {
          scope.odaPanelShownTriggerText = "X";
          $(trigger).addClass('triggered');
        } else {
          scope.odaPanelShownTriggerText = "oda";
          $(trigger).removeClass('triggered');
        }
        // TODO: wire up esc key to hide oda panel when shown
      }
    }
  };
}
