directives.directive('flnDevTools', [flnDevTools_]);

function flnDevTools_ () {
  return {
    templateUrl: 'templates/directives/widgets/flnDevTools.html',
    controller: 'DevCtrl',
    controllerAs: 'dev',
    link: function(scope, element, attrs) {
      scope.toggleUserObject = toggleUserObject;
      scope.toggleDevPanel = toggleDevPanel;
      scope.userShown = true;
      scope.userShownTriggerText = "hide";
      scope.panelShown = false;
      scope.panelShownTriggerText = "dev";

      // TODO: register a dev tools service so directives outside the dev panel can interact with it. see the ModalService and ModalCtrl

      function toggleUserObject() {
        scope.userShown = !scope.userShown;
        scope.userShownTriggerText = (scope.userShown) ? "hide" : "show";
      }

      function toggleDevPanel() {
        var trigger = $(element).find('.dev-trigger');
        scope.panelShown = !scope.panelShown;
        if (scope.panelShown) {
          scope.panelShownTriggerText = "undev";
          $(trigger).addClass('triggered');
        } else {
          scope.panelShownTriggerText = "dev";
          $(trigger).removeClass('triggered');
        }
        // TODO: wire up esc key to hide dev panel when shown
      }
    }
  };
}
