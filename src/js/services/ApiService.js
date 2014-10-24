function ApiService_ ($http, $q) {
  // this Service provides Api access
  var ApiService = {};

  // open to the web
  var baseUrl = "http://scexchange.solarcity.com/scfilefactory/testfill.aspx";
  // only avail inhouse
  // var baseUrl = "http://slc3web00/scexchange/testfill.aspx";

  ApiService.uploadMounts = function(data) {
  	var deferred = $q.defer();
    var x = {};

    x = JSON.stringify(data);

    $.ajax({
    type: "POST",
    url: baseUrl,
    data: {
        "TestJSON": x
    },
    success: function(data){
        var t = JSON.parse(data);
        deferred.resolve(t);
      }
    });

    return deferred.promise;
  };

  return ApiService;
}

angular.module('flannel').service('ApiService', ApiService_);
