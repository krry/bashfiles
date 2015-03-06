module.exports = function(app) {
  var request       = require('request'),
      querystring   = require('querystring'),
      env           = process.env.NODE_ENV || 'development',
      conf          = require('../config/environments/' + env + '.json'),
      jsforce       = require('jsforce');

  var sfLoginUrl    = conf.SFLOGIN_URL,
      sfUserName    = conf.SFUSERNAME,
      sfPassword    = conf.SFPASSWORD;

  var conn = new jsforce.Connection({
    loginUrl: sfLoginUrl
  });

  var login = conn.login(sfUserName, sfPassword);

  function createLead(req){
    return conn.sobject("Lead").create({
      FirstName : req.body.FirstName,
      Lastname : req.body.LastName,
      Street : req.body.Street,
      City : req.body.City,
      State : req.body.State,
      PostalCode : req.body.PostalCode,
      Email : req.body.Email,
      Phone : req.body.Phone,
      ownerId : req.body.OwnerId,
      Company : req.body.FirstName + ' ' + req.body.Lastname,
      LeadSource : req.body.LeadSource,
      LeadStatus : req.query.leadStatus,
      Unqualified_Reason__c : req.query.unqualifiedReason,
      External_ID__c : req.body.ExternalId,
      External_ID_Type__c : 'FirebaseSessionId',
      Consultation_Date__c : new Date(),
      Consultation_Type__c : 'Online',
      Opportunity_Owner__c : '005300000058ZEZAA2',
    }, function(err, ret){
      console.log('in func');
      if (err || !ret.success) {
        return console.error(err, ret);
      }
    });
  }

  function updateLead(req) {
    return conn.sobject('Lead').update({
      Id : req.body.LeadId,
      FirstName : req.body.FirstName,
      Lastname : req.body.LastName,
      Street : req.body.Street,
      City : req.body.City,
      State : req.body.State,
      PostalCode : req.body.PostalCode,
      Email : req.body.Email,
      Phone : req.body.Phone,
      ownerId : req.body.OwnerId,
      Company : req.body.FirstName + ' ' + req.body.Lastname,
      LeadSource : req.body.LeadSource,
      LeadStatus : req.query.leadStatus,
      Unqualified_Reason__c : req.query.unqualifiedReason,
      External_ID__c : req.body.ExternalId,
      External_ID_Type__c : 'FirebaseSessionId',
      Consultation_Date__c : new Date(),
      Consultation_Type__c : 'Online',
      Opportunity_Owner__c : '005300000058ZEZAA2',
    }, function(err, ret) {
      if (err || !ret.success) { 
        return console.error(err, ret); 
      }
    });
  }

  function addEditLead(req, res){
    var result;
    if (req.body.LeadId) {
      result = login.then(updateLead.bind(this, req));
    }
    else {
      result = login.then(createLead.bind(this, req));
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
