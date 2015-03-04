/* ==================================================
  LiveagentService
  this service init's salesforce stuff


================================================== */

angular.module('flannel').factory('Liveagent', LiveagentService_);

function LiveagentService_ () {

  var custom_detail_stream = new Rx.Subject();

  custom_detail_stream.subscribe({
    onNext: x_addDetailsToAgent,
    onCompleted: x_findOrCreateSessionByAddy,
    onError: function (argument) {
      alert("custom_detail_stream error", argument);
    },
  })

  function x_addDetailsToAgent (prospect_key_val) {
    var key = prospect_key_val.key;
    var val = prospect_key_val.value;
    var fieldName = key+'__c';

    console.log("adding custom detail:", key, val);
    console.log("fieldName", fieldName);

    return liveagent.addCustomDetail(key, val).saveToTranscript(fieldName);
  }

  function x_findOrCreateSessionByAddy () {
    // if a Lead exists with the same Form details, find it
    // if no similar Lead exists, create a new one
    liveagent.findOrCreate("ODA_Session__c")
             .map(
              // http://www.salesforce.com/us/developer/docs/live_agent_dev/Content/live_agent_creating_records_API_map.htm
              "Address__c", // FieldName
              "Address",    // DetailName
              true,         // doFind
              true,         // isExactMatch
              true)         // doCreate
              .map(
              "Session_ID__c",
              "session_id",
              false,
              false,
              true
              )
      .showOnCreate().saveToTranscript("ODA_Session__c");

    // initialize the liveagent session
    liveagent.init(
      'https://d.la3-c2cs-chi.salesforceliveagent.com/chat',
      '57219000000CaSA',  // deployment id
      '00D19000000Dtc3'   // configuration id
    );
  }

  return {
    addCustomDetails: function (prospect) {
      // parse the prospect object into addCustomDetail calls that build the Lead object in Salesforce
      // custom details must be added before init of liveagent
      for (var key in prospect) {
        if ( prospect.hasOwnProperty(key)) {
          var value;
          if (key !== "location") {
            value = prospect[key].toString();
            custom_detail_stream.onNext({key: key, value: value});
          }
        }
      }
      // concatenate full address for uniqueness test
      // addy = [prospect.home, prospect.city, prospect.state, prospect.zip].join(' ').toString();
      // console.log('addy concatentate', addy);
      // manually add a few more required fields
      custom_detail_stream.onNext({key: "Address", value: [prospect.home, prospect.city, prospect.state, prospect.zip].join(' ')});
      custom_detail_stream.onCompleted();
      custom_detail_stream.dispose();
    },
    start: function (t) {
      var attempt = 0;
      function tryStartChat (attempt, b, i) {
        // if (attempt < 5) {
          return liveagent.startChatWithWindow(b,i);
        // } else {
          // throw "too many salesforce failures";
        // }
      }

      try {
        attempt++;
        tryStartChat(attempt, t.buttonId, t.iframeTarget);
      } catch (e) {
        setTimeout(function(attempt){
          // attempt++;
          tryStartChat(attempt, t.buttonId, t.iframeTarget);
        }, 350);
      }
    }
  }
}
