module.exports = function(app) {
  var request       = require('request'),
      querystring   = require('querystring'),
      env           = process.env.NODE_ENV || 'development',
      conf          = require('../config/environments/' + env + '.json'),
      jsforce       = require('jsforce');

  var sfLoginUrl    = conf.SFLOGIN_URL,
      sfUserName    = conf.SFUSERNAME,
      sfPassword    = conf.SFPASSWORD,
      sfToken       = conf.SFDCSECRETTOKEN,
      sfRecordType  = conf.SFDCRECORDTYPEID,
      sfOppOwnerId  = conf.SFOPPOWNERID;


  var conn = new jsforce.Connection({
    loginUrl: sfLoginUrl
  });

  var login = conn.login(sfUserName, sfPassword+sfToken);

  function leadObj(req) {
    return {
      FirstName : req.body.FirstName,
      Lastname : req.body.LastName,
      Street : req.body.Street,
      City : req.body.City,
      State : req.body.State,
      PostalCode : req.body.PostalCode,
      Email : req.body.Email,
      Phone : req.body.Phone,
      OwnerId : req.body.OwnerId,
      Company : req.body.FirstName + ' ' + req.body.LastName,
      LeadSource : 'Online',
      Status : req.body.LeadStatus,
      Unqualified_Reason__c : req.body.UnqualifiedReason,
      odaHotloadLink__c: req.body.OdaHotloadLink,
      skipped__c: req.body.Skipped,
      External_ID__c : req.body.ExternalId,
      External_ID_Type__c : 'FirebaseSessionId',
      Consultation_Date__c : new Date(),
      Consultation_Type__c : 'Online',
      Opportunity_Owner__c : sfOppOwnerId,
      RecordTypeId : sfRecordType,
      Share_Proposal_Link__c: req.body.Share_Proposal_Link__c
    };
  }

  function handleResponse(err, ret) {
    if (err || !ret.success) {
      return console.error(err, ret);
    }
  }

  function createLead(lead){
    return conn.sobject('Lead').create(lead, handleResponse);
  }

  function updateLead(lead) {
    return conn.sobject('Lead').update(lead, handleResponse);
  }

  function addEditLead(req, res){
    var lead = leadObj(req),
        result;

    if (req.body.LeadId) {
      // Append the lead id only when updating
      lead.Id = req.body.LeadId;
      result = login.then(updateLead.bind(this, lead));
    }
    else {
      result = login.then(createLead.bind(this, lead));
    }

    result.then(function(result) {
      res.json(result);
    }, function(err) {
      res.json(arguments);
    });
  }

  return {
    addEditLead: addEditLead
  };
};
