/* ==================================================

  AppCtrl
  the core app controller

  to be used only for functions to which the entire
  app needs access, especially for <title>, <meta>,
  and other <head> elements

================================================== */

controllers.controller("AppCtrl", ['$location', '$sce', 'GMAP_CLIENT', 'MINIFIED', 'APP_TITLE', 'ENV', 'Clientstream', 'ANALYTICS_ID', AppCtrl_]);

function AppCtrl_($location, $sce, GMAP_CLIENT, MINIFIED, APP_TITLE, ENV, Client, ANALYTICS_ID) {
  var vm = this;
  vm.minified = MINIFIED;
  vm.appTitle = APP_TITLE;
  vm.gmapClient = GMAP_CLIENT;
  vm.analyticsId = ANALYTICS_ID;

  // if user is an ODA, trigger ODA mode to show ODA tools
  if (window.location.href.indexOf('oda') > -1) {
    vm.isInOdaMode = true;
  }

  // if development environment, trigger dev mode to show dev tools
  vm.isInDevMode = (ENV === "development") ? true : false;

  // loading google analytics trackers
  Client.listen('Stages: step complete', notifyTrackerAboutStep);

  function notifyTrackerAboutStep (step) {
    var location;
    console.log('tracking step:', step);
    // TODO: convert these ifs into a switch
    if (step === "congrats") {
      //ga('send', 'event', step, 'Button Clicks', 'Final submit');
      dataLayer.push({'event': 'final_submit'});
    }
    if (step === "zoom-lock-roof") {
      //ga('send', 'event', step, 'Design Tool', 'Design tool engaged');
      dataLayer.push({'event': 'design_tool_engaged'});
    }
    if (step === "detail-area") {
      //ga('send', 'event', step, 'Design Tool', 'Roof alignment determined');
      dataLayer.push({'event': 'roof_alignment_determined'});
    }
    if (step === "slope") {
      //ga('send', 'event', step, 'Design Tool', 'Roof slope determined');
      dataLayer.push({'event': 'roof_slope_determined'});
    }
    if (step === "trace-area") {
      //ga('send', 'event', step, 'Design Tool', 'Polygon Completed');
      dataLayer.push({'event': 'polygon_completed'});
    }
    // trim query string off path, cache and send to google analytics
    location = $location.url();
    console.log("$location", location);
    //ga('send', 'pageview', $location.$$path); // relative url
    dataLayer.push({
      'event': 'pageview',
      'pageURL': location
    });
  }
}
