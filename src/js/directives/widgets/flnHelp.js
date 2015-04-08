directives.directive('flnHelp', ['Liveagent', 'Clientstream', flnHelp_]);

function flnHelp_ (Liveagent, Client) {
  return {
    templateUrl: 'templates/directives/widgets/flnHelp.html',
    controller: 'ChatCtrl',
    controllerAs: 'chat',
    link: function(scope, element, attrs, ChatCtrl) {
      // TRACK: when a user requests an ODA, track that
      // var step = Stage.step; // fetch the current step from the StageCtrl
      // element.find('#liveagent_button_online_573180000008OIF').on('click', function () {
        // ga('send', 'event', step, 'Button Clicks', 'ODA Session Activated');
      // });

      var chat,
          prospect,
          value,
          chatOpened = false;

      scope.prospect = ChatCtrl.prospect;
      scope.toggleShown = toggleShown;

      // find the liveagent buttons in the window, wire the agent status logic to them
      if (!window._laq) { window._laq = []; }

      window._laq.push(
        function(){
          liveagent.showWhenOnline(
            '573180000008OIF',
            document.getElementById('liveagent_button_online_573180000008OIF')
          );

          liveagent.showWhenOffline(
            '573180000008OIF',
            document.getElementById('liveagent_button_offline_573180000008OIF')
          );
        }
      );

      $(element).find('.liveagent-online').on('click', function(){
        var address;

        if (!chatOpened) {

          // retrieve prospect object from Form in Firebase
          // TODO: figure out why this prospect does not have a `form_id` like the prospect in FormProvider

          Client.emit('create hotload link', true);

          // send prospect to Liveagent
          Liveagent.addCustomDetails(scope.prospect());

          var targetConfig = {
            buttonId: "573180000008OIF",
            iframeTarget: "live_agent_chat"
          }
          // try to start the Liveagent chat
          Liveagent.start(targetConfig);
          chatOpened = true;
          scope.active = true;
        }
      });

      function toggleShown () {
        scope.shown = !scope.shown;
        return scope.shown;
      }
    }
  };
}
