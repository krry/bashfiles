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

          // parse the prospect object into addCustomDetail calls that build the Lead object in Salesforce
          // custom details must be added before init of liveagent
          for (var key in prospect) {
            if ( prospect.hasOwnProperty(key)) {
              if (key !== "location") {
                console.log("adding custom detail:", key, value);
                value = prospect[key].toString();
                liveagent.addCustomDetail(key, value).saveToTranscript(key+'__c');
              }
            }
          }

          // concatenate full address for uniqueness test
          address = [prospect.home, prospect.city, prospect.state, prospect.zip].join(' ');

          // manually add a few more required fields
          liveagent.addCustomDetail("Address", address).saveToTranscript('Address__c');

          // if a Lead exists with the same Form details, find it
          // if no similar Lead exists, create a new one
          liveagent.findOrCreate("ODA_Session__c")
                   .map("Address__c", "Address", true, true, true)
                   .showOnCreate().saveToTranscript("ODA_Session__c");

          // initialize the liveagent session with a deployment id, and configuration id
          liveagent.init('https://d.la3-c2cs-chi.salesforceliveagent.com/chat', '57219000000CaSA', '00D19000000Dtc3');

          setTimeout(function(){
            // start a chat with button id [1st parameter] within an iframe [2nd parameter]
            liveagent.startChatWithWindow("57319000000CaTc", "live_agent_chat");
            chatOpened = true;
          }, 1000)
        }
      });

      function toggleShown () {
        scope.shown = !scope.shown;
        return scope.shown;
      }
    }
  };
}
