directives.directive('flnHelp', ['Liveagent', flnHelp]);

function flnHelp (Liveagent) {
  return {
    templateUrl: 'templates/directives/widgets/flnHelp.html',
    controller: 'ChatCtrl',
    controllerAs: 'chat',
    link: function(scope, element, attrs) {
      // TRACK: when a user requests an ODA, track that
      // var step = Stage.step; // fetch the current step from the StageCtrl
      // element.find('#liveagent_button_online_57319000000CaTc').on('click', function () {
        // ga('send', 'event', step, 'Button Clicks', 'ODA Session Activated');
      // });

      var chatbox,
          prospect,
          value,
          chatOpened = false;

      scope.toggleShown = toggleShown;

      // find the liveagent buttons in the window, wire the agent status logic to them
      if (!window._laq) { window._laq = []; }

      window._laq.push(
        function(){
          liveagent.showWhenOnline(
            '57319000000CaTc',
            document.getElementById('liveagent_button_online_57319000000CaTc')
          );

          liveagent.showWhenOffline(
            '57319000000CaTc',
            document.getElementById('liveagent_button_offline_57319000000CaTc')
          );
        }
      );

      $(element).find('.liveagent-online').on('click', function(){
        var address;

        if (!chatOpened) {

          // retrieve prospect object from Form in Firebase
          // TODO: figure out why this prospect does not have a `form_id` like the prospect in FormProvider
          prospect = scope.prospect();
          // send prospect to Liveagent
          Liveagent.addCustomDetails(prospect);

          var targetConfig = {
            buttonId: "57319000000CaTc",
            iframeTarget: "live_agent_chat"
          }
          // try to start the Liveagent chat
          Liveagent.start(targetConfig);
          chatOpened = true;
        }
      });

      function toggleShown () {
        scope.shown = !scope.shown;
        return scope.shown;
      }
    }
  };
}
