directives.directive('flnHelp', ['Liveagent', 'Clientstream', 'SF_BUTTON_ID', flnHelp_]);

function flnHelp_ (Liveagent, Client, SF_BUTTON_ID) {
  return {
    templateUrl: 'templates/directives/widgets/flnHelp.html',
    controller: 'ChatCtrl',
    controllerAs: 'chat',
    link: function(scope, element, attrs, ChatCtrl) {
      // TRACK: when a user requests an ODA, track that
      // var step = Stage.step; // fetch the current step from the StageCtrl
      // element.find('#liveagent_button_online_'+SF_BUTTON_ID).on('click', function () {
        // ga('send', 'event', step, 'Button Clicks', 'ODA Session Activated');
      // });

      var chat,
          prospect,
          value,
          chatOpened = false;

      scope.prospect = ChatCtrl.prospect;
      scope.toggleShown = toggleShown;
      scope.sfButtonId = SF_BUTTON_ID;

      // find the liveagent buttons in the window, wire the agent status logic to them
      if (!window._laq) { window._laq = []; }

      window._laq.push(
        function(){
          liveagent.showWhenOnline(

            SF_BUTTON_ID,
            document.getElementById('liveagent_button_online_'+SF_BUTTON_ID)
          );

          liveagent.showWhenOffline(
            SF_BUTTON_ID,
            document.getElementById('liveagent_button_offline_'+SF_BUTTON_ID)
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

            buttonId: SF_BUTTON_ID,
            buttonId: "57314000000TPbN",
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
