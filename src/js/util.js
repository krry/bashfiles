goToByScroll: function(data_slide) {
  htmlbody = $('html,body');
  htmlbody.animate({
      scrollTop: $('[data-slide="' + data_slide + '"]').offset().top
  }, 500, 'easeInOutCubic');
},

zipCheck: function(){
  $("#zip").keyup(function(e){
    var $zipVal = $(this).val();
    var key = e.keyCode || e.which;
    var arrows = [9,16,37,38,39,40];
    if (arrows.indexOf(key) < 0){
      if ($zipVal.length === 5 && !current.geoLock) {
        current.step = 1;
        current.zip = $zipVal;
        current.map = roofMap;
        current.geoLock = true;
        // fst.log("firing zip geocode for " + current.zip);
        Roofer.reverseGeocode(current.zip, current.zip);
      }
    }
  });
},

checkTerritory: function(zip) {
  var data = 'zip='+zip.toString();
  // console.log('data is ' + data);
  if (zip != null) {
    $.ajax({
      url: '//scexchange.solarcity.com/scfilefactory/app_handler/checkTerritory.ashx',
      // url: '//slc3web00.solarcity.com/scexchange/app_handler/checkTerritory.ashx',
      type: 'POST',
      data: data,
      dataType: 'json',
      error: function(){
        // console.log("checkTerritory API is unavailable. Using backup database.");
        fst.checkZipDB(zip);
      },
      success: function(data) {
        // data = {'InTerritory' : 'false/true'}
        // console.log(typeof(data));
        // console.log(data);
        if (data['InTerritory']) {
          fst.goodAddy('We service that area.')
        }
        else {
          fst.badAddy('We do not yet service that area.')
        }
        return $('#street').focus();
      }
    });
  }
},

checkZipDB: function(zip) {
  // fst.log('checking territory for ' + zip);
  if (zip != null) {
    $.ajax({
      url: '../check/zip',
      type: 'POST',
      data: {'zip': zip},
      error: function(jqXHR, textStatus, errorThrown) {
        // console.log('zipCheck ajax POST error:');
        // console.log(jqXHR);
        // console.log(textStatus);
        // console.log(errorThrown);
        fst.badAddy('The territory check service is unavailable.');
      },
      success: function(data, textStatus, jqXHR) {
        var loc = JSON.parse(data);
        // console.log("zip db response: ");
        // console.log(loc);
        if (loc.length > 0) {
          fst.goodAddy('We service that area');
        }
        else {
          fst.badAddy('We do not yet service that area.');
        }
      }
    });
  }
},

