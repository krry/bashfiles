/* ==================================================

  flnOlMap

  a directive used to create an OpenLayers map

  TODO:
    * sync itself with firebase on '$destroy'

================================================== */

directives.directive('flnOlMap', ['Clientstream', flnOlMap_]);

function flnOlMap_ (Client) {
  return {
    restrict: "A",
    link: function flnOlMapLink(scope, ele, attrs) {
      // in the case we have a new user, the directive needs to
      // wait until it configurator is
      // loaded before attaching configurator to map
      Client.listen('Configurator: Loaded', sendElement);
      function sendElement (interactions) {
        Client.emit('OlMap: map target element', ele);
      }
      ele.on('$destroy', function (e) {
        // make sure we sync whatever is going on with firebase
        // what else?
        console.log("check it brah, i'm syncing with firebase!");
      });
    },
  };
}
