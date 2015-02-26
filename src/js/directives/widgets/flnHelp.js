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

        if (!chatOpened) {

          // retrieve prospect object from Form in Firebase
          prospect = scope.prospect();

          // parse the prospect object into addCustomDetail calls that build the Lead object in Salesforce
          // custom details must be added before init of liveagent
          for (var key in prospect) {
            if ( prospect.hasOwnProperty(key)) {
              if (key !== "location") {
                console.log("adding custom detail:", key, value);
                value = prospect[key].toString();
                liveagent.addCustomDetail(key, value);
              }
            }
          }

          // manually add a few more required fields
          liveagent.addCustomDetail("Status", "Open");
          liveagent.addCustomDetail("Company", "a");
          liveagent.addCustomDetail("LastName","a");

          // if a Lead exists with the same Form details, find it
          // if no similar Lead exists, create a new one
          liveagent.findOrCreate("Lead")
                   .map("Street", "home", true, true, true)
                   .map("City","city", true, true, true)
                   .map("State", "state", true, true, true)
                   .map("PostalCode", "zip", true, true, true)
                   .map("Country","country", true, true, true)
                   .map("Monthly_Electric_Bill__c", "bill", true, true, true)
                   .map("Status", "Status", true, true, true)
                   .map("LastName", "LastName", true,true,true)
                   .showOnCreate().saveToTranscript("Lead");

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
