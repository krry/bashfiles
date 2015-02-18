controllers.controller('TrackerCtrl', ['Clientstream', '$location', TrackerCtrl_]);

//

function TrackerCtrl_ (Client, $location) {
  var vm = this;

  Client.listen('step', notifyTrackerAboutStep);

  function notifyTrackerAboutStep (step) {
    if (step === "congrats") {
      ga('send', 'event', 'Congrats', 'Button Clicks', 'Final submit');
    }
    if (step === "zoom-lock-roof") {
      ga('send', 'event', step, 'Design Tool', 'Design tool engaged');
    }
    if (step === "detail-area") {
      ga('send', 'event', step, 'Design Tool', 'Roof alignment determined');
    }
    if (step === "area-slope") {
      ga('send', 'event', step, 'Design Tool', 'Roof slope determined');
    }
    if (step === "complete-area") {
      ga('send', 'event', step, 'Design Tool', 'Polygon Completed');
    }
    // ga('send', 'pageview', '/RELATIVE-URL');
    ga('send', 'pageview', $location.path); // relative url
  }
}
