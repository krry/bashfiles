/* ==================================================
  UrlService
  parses url parameters outside of ui-router's $state


================================================== */

angular.module('flannel').factory('UrlService', [UrlService_]);

function UrlService_ () {
  function getParameterByName(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(location.search);
    return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
  }

  return {
    getParameterByName: getParameterByName
  };
}
