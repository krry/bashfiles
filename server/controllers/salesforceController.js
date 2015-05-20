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
      sfOppOwnerId  = conf.SFOPPOWNERID,
      sessions      = {};

  var onlineSellingConn = new jsforce.Connection({
    loginUrl: sfLoginUrl
  });

  var onlineSellingLogin = onlineSellingConn.login(sfUserName, sfPassword+sfToken);

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
      proposalLink__c: req.body.ProposalLink,
      siteSurveyLink__c: req.body.SiteSurveyLink,
      skipped__c: req.body.Skipped,
      External_ID__c : req.body.ExternalId,
      External_ID_Type__c : 'FirebaseSessionId',
      Consultation_Date__c : new Date(),
      Consultation_Type__c : 'Online',
      Opportunity_Owner__c : sfOppOwnerId,
      RecordTypeId : sfRecordType,
      Share_Proposal_Link__c: req.body.Share_Proposal_Link__c,
      Panel_Count__c: req.body.PanelCount,
      Average_Yield__c: req.body.AverageYield,
      Estimated_Production__c: req.body.EstimatedProduction,
      Average_Monthly_Bill__c: req.body.AverageMonthlyBill,
      Utility_Rate__c: req.body.UtilityRate,
      SolarCity_Rate__c: req.body.SolarCityRate,
      Estimated_First_Year_Savings__c: req.body.EstimatedFirstYearSavings,
      Estimated_Offset__c: req.body.EstimatedOffset
    };
  }

  function handleResponse(err, ret) {
    if (err || !ret.success) {
      return console.error(err, ret);
    }
  }

  function createLead(conn, lead){
    return conn.sobject('Lead').create(lead, handleResponse);
  }

  function updateLead(conn, lead) {
    return conn.sobject('Lead').update(lead, handleResponse);
  }

  function addEditLead(req, res){
    var lead = leadObj(req),
        conn,
        action;

    // If we get passed a specific Salesforce session, use that for the connection
    if (req.body.Session) {
      conn = createConn({
        serverUrl: req.body.Session.serverUrl,
        sessionId: req.body.Session.sessionId
      });
    // Else, use the online selling API session
    } else {
      conn = onlineSellingConn;
    }

    // Can only pass in the lead source when we first create it
    if (req.body.Session && !req.body.LeadId) {
      lead.Partner_Detail__c = req.body.Session.partnerId;
    }

    if (req.body.LeadId) {
      // Append the lead id only when updating
      lead.Id = req.body.LeadId;
      action = updateLead.bind(this, conn, lead);
    } else {
      action = createLead.bind(this, conn, lead);
    }

    onlineSellingLogin
    .then(action)
    .then(function(result) {
      res.json(result);
    }, function(err) {
      res.json(arguments);
    });
  }

  // Stores Salesforce session info into memory
  // Allows authenticating to Salesforce as a specific user
  function storeSession(req, res) {
    var id = req.body.sessionId,
        success = false;

    if (id) {
      success = true;
      sessions[id] = {
        serverUrl: req.body.serverUrl,
        sessionId: req.body.sessionId,
        partnerId: req.body.partnerId
      };
    }

    res.json({ success: success });
  }

  // Preloads a stored Salesforce session into the user's cookies
  function preloadSession(req, res) {
    var id = req.query.id,
        data = sessions[id],
        deleteConfig = { expires: new Date(1) },
        cookieConfig = { maxAge: 1*24*60*60*1000 };

    if (data) {
      // res.clearCookie() doesn't seem to work
      res.cookie('sf_server_url', '', deleteConfig);
      res.cookie('sf_session_id', '', deleteConfig);
      res.cookie('sf_partner_id', '', deleteConfig);

      res.cookie('sf_server_url', data.serverUrl, cookieConfig);
      res.cookie('sf_session_id', data.sessionId, cookieConfig);
      res.cookie('sf_partner_id', data.partnerId, cookieConfig);

      // Clear it out from memory once stored into cookies
      sessions[id] = null;
    }

    res.redirect('/');
  }

  function getIdentity(req, res) {
    var conn = createConn({
      serverUrl: req.body.serverUrl,
      sessionId: req.body.sessionId
    });

    conn.identity(function(err, resp) {
      if (err) {
        res.status(500);
        res.json(err);
      } else {
        res.json({
          display_name: resp.display_name
        });
      }
    });
  }

  function createConn(credentials) {
    return new jsforce.Connection(credentials);
  }

  return {
    addEditLead: addEditLead,
    storeSession: storeSession,
    preloadSession: preloadSession,
    getIdentity: getIdentity
  };
};
