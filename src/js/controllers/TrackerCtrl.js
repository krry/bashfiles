controllers.controller('TrackerCtrl', ['Clientstream', '$location', TrackerCtrl_]);

function TrackerCtrl_ (Client, $location) {
  var vm = this;

  Client.listen('step', notifyTrackerAboutStep);

  function notifyTrackerAboutStep (step) {
    if (step === "congrats") {
      ga('send', 'event', 'Congrats', 'Button Clicks', 'Final submit');
    }
    // ga('send', 'pageview', '/RELATIVE-URL');
    ga('send', 'pageview', $location.path); // relative url
  }

}
