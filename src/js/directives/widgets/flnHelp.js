directives.directive('flnHelp', flnHelp);

function flnHelp () {
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
        if (!chatOpened) {
          // $('#liveAgentChat').attr('src','https://d.la3-c2cs-chi.salesforceliveagent.com/content/s/chat?language=en#deployment_id=57219000000CaSA&org_id=00D19000000Dtc3&button_id=57319000000CaTc&session_id=9dc885db-a138-4214-a731-f02d83aa9a12');

          prospect = scope.prospect();
          console.log("retrieving prospect from Form in Firebase", prospect);
          for (var key in prospect) {
            if ( prospect.hasOwnProperty(key)) {
              if (key !== "location") {
                console.log("adding custom detail:", key, value);
                value = prospect[key].toString();
                liveagent.addCustomDetail(key, value);
              }
            }
          }

          liveagent.init('https://d.la3-c2cs-chi.salesforceliveagent.com/chat', '57219000000CaSA', '00D19000000Dtc3');

          // might have to auth with Salesforce to get past the login gate which seems to have X-Frame-Options: DENY
          // might have to
          setTimeout(function(){
            liveagent.startChatWithWindow("57319000000CaTc", "live_agent_chat");
            chatOpened = true;
          }, 500)
        }
      });

      function toggleShown () {
        scope.shown = !scope.shown;
        return scope.shown;
      }
    }
  };
}
