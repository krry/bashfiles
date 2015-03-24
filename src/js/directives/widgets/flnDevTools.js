directives.directive('flnDevTools', [flnDevTools_]);

function flnDevTools_ () {
  return {
    templateUrl: 'templates/directives/widgets/flnDevTools.html',
    controller: 'DevCtrl',
    controllerAs: 'dev',
    link: function(scope, element, attrs) {
      scope.toggleDevPanel = toggleDevPanel;
      scope.devPanelShown = false;
      scope.devPanelShownTriggerText = "dev";

      // TODO: register a dev tools service so directives outside the dev panel can interact with it. see the ModalService and ModalCtrl

      function toggleDevPanel() {
        var trigger = $(element).find('.dev-trigger');
        scope.devPanelShown = !scope.devPanelShown;
        if (scope.devPanelShown) {
          scope.devPanelShownTriggerText = "undev";
          $(trigger).addClass('triggered');
        } else {
          scope.devPanelShownTriggerText = "dev";
          $(trigger).removeClass('triggered');
        }
        // TODO: wire up esc key to hide dev panel when shown
      }
    }
  };
}
