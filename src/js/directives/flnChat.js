directives.directive('flnChat', flnChat);

function flnChat () {
  return {
    restrict: "A",
    templateUrl: 'templates/directives/flnChat.html',
    controller: 'ChatCtrl',
    controllerAs: 'chat',
    link: function(scope, element, attrs) {
      // TRACK: when a user requests an ODA, track that
      var step = Stage.step; // fetch the current step from the StageCtrl
      element.find('#liveagent_button_online_57319000000CaTc').on('click', function () {
        ga('send', 'event', step, 'Button Clicks', 'ODA Session Activated');
      })

      // if (!window._laq) { window._laq = []; }
      // window._laq.push(
      //   function(){
      //           console.log("butts are runnin", liveagent);
      //     liveagent.showWhenOnline(
      //       '57319000000CaTc',
      //       document.getElementById('liveagent_button_online_57319000000CaTc')
      //     );


      //     liveagent.showWhenOffline(
      //       '57319000000CaTc',
      //       document.getElementById('liveagent_button_offline_57319000000CaTc')
      //     );
      //   }
      // );
      /* declare global box variable,
        so we can check if box is alreay open,
        when user click toggle button */

      // we are now adding click handler for toggle button

      // TODO: remove the `ui` param when we peel out jquery-ui
      // $(element).find('#chat-trigger').click( function (event, ui) {
      //   /* now if box is not null, we are toggling chat box */
      //   if ($(element).chatbox()) {
      //     /* below code will hide the chatbox that is active,
      //        when first clicked on toggle button */
      //     $(element).chatbox("option", "boxManager").toggleBox();
      //     liveagent.startChat('57319000000CaTc');
      //   } else {
      //     $('#liveAgentChat').attr('src','https://d.la3-c2cs-chi.salesforceliveagent.com/content/s/chat?language=en#deployment_id=57219000000CaSA&org_id=00D19000000Dtc3&button_id=57319000000CaTc&session_id=9dc885db-a138-4214-a731-f02d83aa9a12');
      //     /* if box variable is null then we will create chat-box */
      //     element = $("#chat-trigger").chatbox({
      //       /* unique id for chat box */
      //       id: "chatbox",
      //       user: { key : "value" },
      //       /* Title for the chat box */
      //       title : "SolarCity",
      //     });
      //   }
      // });
    }
  };
}
